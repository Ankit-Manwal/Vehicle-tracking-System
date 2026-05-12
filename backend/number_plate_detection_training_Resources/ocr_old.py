import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import re
import torch
from collections import defaultdict, deque
import os
import time

from cameras import CAMERAS
from detections_store import (
    add_detection,
    should_add_detection,
    get_number_plates_to_detect,
)

print(torch.cuda.is_available())
print(torch.cuda.get_device_name(0))


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DETECTED_IMAGES_DIR = os.path.join(
    os.path.dirname(BASE_DIR),
    "detected_vehicle_images",
)
os.makedirs(DETECTED_IMAGES_DIR, exist_ok=True)
print("Base directory:", BASE_DIR)
# ---------------------------------------------------
# 4️⃣ Function to correct OCR mistakes
# ---------------------------------------------------
def correct_plate_format(ocr_text):
    """
    Corrects common OCR mistakes in license plates.
    Expected format: AA11AAA
    """

    # Mapping numbers that often look like letters
    mapping_num_to_alpha = {
        "0": "O",
        "1": "I",
        "5": "S",
        "8": "B"
    }

    # Mapping letters that often look like numbers
    mapping_alpha_to_num = {
        "O": "0",
        "I": "1",
        "Z": "2",
        "S": "5",
        "B": "8"
    }

    # Clean the OCR text
    ocr_text = ocr_text.upper().replace(" ", "")

    # If length is not 7 → discard
    if len(ocr_text) != 7:
        return ""

    corrected = []

    # Loop through each character
    for i, ch in enumerate(ocr_text):

        # ------------------------------------------
        # Alphabet positions (0,1 and 4,5,6)
        # ------------------------------------------
        if i < 2 or i >= 4:

            # If digit found in alphabet position → convert if possible
            if ch.isdigit() and ch in mapping_num_to_alpha:
                corrected.append(mapping_num_to_alpha[ch])

            # If already alphabet → keep it
            elif ch.isalpha():
                corrected.append(ch)

            # Invalid character
            else:
                return ""

        # ------------------------------------------
        # Numeric positions (2,3)
        # ------------------------------------------
        else:

            # If alphabet found in numeric position → convert if possible
            if ch.isalpha() and ch in mapping_alpha_to_num:
                corrected.append(mapping_alpha_to_num[ch])

            # If already digit → keep it
            elif ch.isdigit():
                corrected.append(ch)

            # Invalid character
            else:
                return ""

    return "".join(corrected)





# import cv2

def recognize_plate(plate_crop):
    """
    Takes a cropped license plate image
    Runs preprocessing + OCR
    Returns a corrected and validated plate string
    """

    # -----------------------------------------
    # 1️⃣ Safety check (empty crop)
    # -----------------------------------------
    if plate_crop is None or plate_crop.size == 0:
        return ""

    # -----------------------------------------
    # 2️⃣ Preprocessing for better OCR accuracy
    # -----------------------------------------

    # Convert to grayscale
    gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)

    # Apply OTSU thresholding (automatic binarization)
    _, thresh = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    # Resize image (increase size improves OCR accuracy)
    plate_resized = cv2.resize(
        thresh,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    # -----------------------------------------
    # 3️⃣ Run EasyOCR
    # -----------------------------------------
    try:
        ocr_result = reader.readtext(
            plate_resized,
            detail=0,  # only return text
            allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        )

        # -------------------------------------
        # 4️⃣ Validate and correct result
        # -------------------------------------
        if len(ocr_result) > 0:

            # Take first detected string
            candidate = correct_plate_format(ocr_result[0])

            # Check against regex pattern
            if candidate and plate_pattern.match(candidate):
                return candidate

    except Exception as e:
        # You can print error for debugging
        # print("OCR Error:", e)
        pass

    return ""



# from collections import defaultdict, deque

# --------------------------------------------------
# Store last 10 OCR predictions per detected box
# --------------------------------------------------
plate_history = defaultdict(lambda: deque(maxlen=10))

# Store final stable plate result per box
plate_final = {}

# --------------------------------------------------
# Generate a pseudo ID for each bounding box
# --------------------------------------------------
def get_box_id(x1, y1, x2, y2):
    """
    Creates a pseudo ID using rounded box coordinates.
    This helps track the same plate across frames.
    """
    return f"{int(x1/10)}_{int(y1/10)}_{int(x2/10)}_{int(y2/10)}"

# --------------------------------------------------
# Stabilize OCR result using majority voting
# --------------------------------------------------
def get_stable_plate(box_id, new_text):
    """
    Maintains history of OCR predictions for a plate
    and returns the most frequent (stable) result.
    """

    # Add new OCR prediction to history
    if new_text:
        plate_history[box_id].append(new_text)

        # Majority voting (most common value)
        most_common = max(
            set(plate_history[box_id]),
            key=plate_history[box_id].count
        )

        # Save stable result
        plate_final[box_id] = most_common

    # Return stable plate (or empty if none)
    return plate_final.get(box_id, "")

def resize_plate_relative(
        plate_crop,
        frame_w=1280,
        frame_h=720,
        scale=0.2,
        overlay_w=None,
        overlay_h=None
):
    """
    Resize license plate image.

    If overlay_w and overlay_h are provided → use fixed size.
    Otherwise → resize relative to frame width using scale.

    Parameters:
        plate_crop : Cropped plate image
        frame_w    : Frame width
        frame_h    : Frame height (not required but kept for flexibility)
        scale      : Percentage of frame width (used if fixed size not given)
        overlay_w  : Fixed overlay width (optional)
        overlay_h  : Fixed overlay height (optional)

    Returns:
        Resized plate image
    """

    if plate_crop is None or plate_crop.size == 0:
        return plate_crop

    # ✅ If fixed size provided
    if overlay_w is not None and overlay_h is not None:
        return cv2.resize(plate_crop, (overlay_w, overlay_h))

    # ✅ Otherwise use scale-based resizing
    new_w = int(frame_w * scale)

    aspect_ratio = plate_crop.shape[0] / plate_crop.shape[1]
    new_h = int(new_w * aspect_ratio)

    plate_resized = cv2.resize(plate_crop, (new_w, new_h))

    return plate_resized


# import cv2

# --------------------------------------------------
# Input / Output video paths
# --------------------------------------------------
input_video = os.path.join(BASE_DIR, "test_images_and_videos", "video4.mp4")
mask_path = os.path.join(BASE_DIR, "test_images_and_videos", "mask4.png")
yolo_path = os.path.join(BASE_DIR, "saved_models", "license_plate_best.pt")


frame_size_w=1280
frame_size_h=720


# --------------------------------------------------
# Detection confidence threshold
# --------------------------------------------------
CONF_THRESH = 0.3

# Load pre-created mask image (white = keep, black = ignore)
road_mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

if road_mask is None:
    print("❌ Mask image not found")
    exit()

road_mask = cv2.resize(road_mask, (frame_size_w, frame_size_h))




model = YOLO(yolo_path)  # load custom YOLO model trained on license plates
model.to("cuda")  # move YOLO to GPU

reader = easyocr.Reader(['en'], gpu=torch.cuda.is_available())
# reader = easyocr.Reader(['en'], gpu=False)

# 2 letters + 2 numbers + 3 letters
plate_pattern = re.compile(r"^[A-Z]{2}[0-9]{2}[A-Z]{3}$")


def save_detection_image(plate, camera_id, frame, timestamp):
    """
    Save a snapshot frame for a detected vehicle and return a frontend-friendly path.
    """
    safe_plate = re.sub(r"[^A-Z0-9]", "_", (plate or "").upper())
    safe_camera = re.sub(r"[^A-Z0-9_-]", "_", camera_id or "unknown")
    filename = f"{safe_plate}_{safe_camera}_{timestamp}.jpg"
    file_path = os.path.join(DETECTED_IMAGES_DIR, filename)

    ok = cv2.imwrite(file_path, frame)
    if not ok:
        return ""

    return f"/detected-images/{filename}"


def generate_frames(target_plate, camera_id=None, should_continue=None):
        # --------------------------------------------------
    # Open input video
    # --------------------------------------------------
    cap = cv2.VideoCapture(input_video)

    if not cap.isOpened():
        print("❌ Error: Cannot open video file")
        exit()

    # ==========================================================
    # 5️⃣ MAIN LOOP
    # ==========================================================
    while cap.isOpened():
        if should_continue and not should_continue():
            break

        ret, frame = cap.read()

        if not ret:
            print("Video ended or failed")
            break


        frame = cv2.resize(frame, (frame_size_w, frame_size_h))

        original_frame = frame.copy()  


        # masked_frame = cv2.bitwise_and(frame, road_mask)  # overlap mask and actual video to get only counting area

        # Resize mask to match frame size
        # mask_resized = cv2.resize(road_mask, (frame.shape[1], frame.shape[0]))

        # Apply mask
        frame_masked = cv2.bitwise_and(frame, frame, mask=road_mask)


        # YOLO detection
        # results = model(frame_masked, device=0, verbose=False)  # gpu

        results = model.track(frame, persist=True, device=0, verbose=False)


        for r in results:
            boxes = r.boxes

            for box in boxes:
                if should_continue and not should_continue():
                    break

                # conf = float(box.conf.cpu().numpy())
                if box.id is None:
                 continue

                track_id = int(box.id.item())
                box_id = f"{track_id}"  # Use track ID as box ID for better stability across frames


                conf = box.conf.item() 
                # box.conf => tensor([0.87], device='cuda:0')
                # item() => tensor([0.87]) → 0.87 -> float by default



                if conf < CONF_THRESH:
                    continue

                # Move bbox tensor from GPU to CPU, convert to NumPy, extract [x1,y1,x2,y2], and convert float coords to integers
                x1, y1, x2, y2 = map(int, box.xyxy.cpu().numpy()[0])  

                plate_crop = original_frame[y1:y2, x1:x2].copy()


                #frame.shape = (height, width, channels)

                # (x1, y1)--------
                #       |         |
                #       |         |     
                #       --------- (x2, y2)


                # OCR
                text = recognize_plate(plate_crop)

                # Stabilization
                # box_id = get_box_id(x1, y1, x2, y2)
                stable_text = get_stable_plate(box_id, text)
                active_target_plates = set(get_number_plates_to_detect())
                should_track_plate = bool(stable_text) and stable_text in active_target_plates
                detection_meta = None
                detection_ts = None

                # If we have a stable plate and a known camera,
                # record this detection (order is naturally preserved)
                if (
                    should_track_plate
                    and camera_id
                    and camera_id in CAMERAS
                    and should_add_detection(stable_text, camera_id)
                ):
                    detection_meta = CAMERAS[camera_id]
                    detection_ts = int(time.time())

                # Draw rectangle
                cv2.rectangle(
                                frame,          # image
                                (x1, y1),       # top-left
                                (x2, y2),       # bottom-right
                                (0,255,0),      # color (green)
                                1               # thickness
                            )


                # Overlay zoomed plate
                if plate_crop.size > 0:

                    # overlay_h, overlay_w = 150, 400

                    plate_resized = resize_plate_relative(plate_crop, scale=0.25)

                    overlay_h, overlay_w = plate_resized.shape[:2]


                    oy1 = max(0, y1 - overlay_h - 40)
                    ox1 = x1
                    oy2 = oy1 + overlay_h
                    ox2 = ox1 + overlay_w

                    #       Overlay (zoomed plate)

                    # (ox1, oy1)
                    #      ●───────────────●
                    #      │               │
                    #      │   Overlay     │
                    #      │               │
                    #      ●───────────────●
                    #        ↑             (ox2, oy2)
                    #        ↑ 
                    #        ↑ 40px gap
                    #        ↑ 
                    # (x1, y1)
                    #      ●───────────────●
                    #      │               │
                    #      │   Plate Box   │
                    #      │               │
                    #      ●───────────────●
                    #                    (x2, y2)

             
                    if oy2 <= frame.shape[0] and ox2 <= frame.shape[1]:
                        frame[oy1:oy2, ox1:ox2] = plate_resized


                        if should_track_plate:
                            print("Target plate detected.")
                            # White text
                            cv2.putText(
                                frame, "Matched: " + stable_text,
                                (ox1, oy1 - 20),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                1, (0,255,0), 2
                            )
                        else:
                                    # Text with black outline
                            cv2.putText(
                                    frame,                 # 1️⃣ image
                                    stable_text,           # 2️⃣ text string
                                    (ox1, oy1 - 20),       # 3️⃣ position (x, y)
                                    cv2.FONT_HERSHEY_SIMPLEX,  # 4️⃣ font type
                                    2,                     # 5️⃣ font scale (size)
                                    (0,0,0),               # 6️⃣ color (black, BGR)
                                    4                      # 7️⃣ thickness
                                )

                if detection_meta and detection_ts:
                    image_path = save_detection_image(
                        plate=stable_text,
                        camera_id=camera_id,
                        frame=frame,
                        timestamp=detection_ts,
                    )
                    was_added = add_detection(
                        plate=stable_text,
                        camera=camera_id,
                        lat=detection_meta["lat"],
                        lng=detection_meta["lng"],
                        address=detection_meta["address"],
                        timestamp=detection_ts,
                        image_path=image_path,
                    )
                    if was_added:
                        print(f"Detection recorded ocr: {stable_text} at {camera_id}")

            if should_continue and not should_continue():
                break

        # -------------------------------------------------
        # Convert processed OpenCV frame to JPEG
        # -------------------------------------------------

        # Encode the frame as a JPEG image
        # cv2.imencode returns:
        #   ret2  -> True/False (success flag)
        #   buffer -> encoded image in memory (not saved to disk)
        ret2, buffer = cv2.imencode('.jpg', frame)

        # Convert encoded image to raw bytes
        # Browsers require binary bytes, not NumPy arrays
        frame_bytes = buffer.tobytes()

        # -------------------------------------------------
        # Yield frame in MJPEG streaming format
        # -------------------------------------------------

        yield (
            b'--frame\r\n'                     # Boundary string (must match Response mimetype)
            b'Content-Type: image/jpeg\r\n\r\n'  # Tell browser this chunk is a JPEG image
            + frame_bytes +                    # Actual image bytes
            b'\r\n'                            # End of frame
        )

    # ==========================================================
    # CLEANUP
    # ==========================================================
    cap.release()

