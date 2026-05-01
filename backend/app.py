import os
import json
from flask import Flask, Response, jsonify, request, send_from_directory
from flask_cors import CORS
from number_plate_detection_training_Resources import ocr
from detections_store import (
    get_all_detections,
    get_plate_detections,
    clear_plate_detections,
    get_number_plates_to_detect,
    add_number_plate_to_detect,
    remove_number_plate_to_detect,
)

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DETECTED_IMAGES_DIR = os.path.join(BASE_DIR, "detected_vehicle_images")
ACTIVE_STREAMS = {}

# Allow React frontend
CORS(app)

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store"
    return response



def load_data():
    with open("vehicles.json") as f:
        return json.load(f)



@app.route("/vehicle/<plate>")
def get_vehicle(plate):
    data = load_data()
    plate = plate.upper().strip()
    return jsonify(data.get(plate, {}))


# -------------------------------------------------
# ✅ Default Route
# -------------------------------------------------
@app.route('/')
def home():
    return jsonify({
        "message": "License Plate Detection API Running",
        "endpoints": {
            "video_stream": "/video",
            "health_check": "/health"
        }
    })


# -------------------------------------------------
# ✅ Health Check Route
# -------------------------------------------------
@app.route('/health')
def health():
    return jsonify({
        "status": "OK",
        "model_loaded": True
    })


# -------------------------------------------------
# ✅ Video Stream Route
# -------------------------------------------------
@app.route('/video')
def video_feed():
    target_plate = request.args.get('target_plate', default=None, type=str)
    camera_id = request.args.get('camera', default=None, type=str)
    client_id = request.args.get('client_id', default="", type=str).strip()
    stream_id = request.args.get('stream_id', default="", type=str).strip()

    if client_id and stream_id:
        ACTIVE_STREAMS[client_id] = stream_id

    def should_continue():
        if not client_id or not stream_id:
            return True
        return ACTIVE_STREAMS.get(client_id) == stream_id

    try:
        return Response(
            ocr.generate_frames(
                target_plate=target_plate,
                camera_id=camera_id,
                should_continue=should_continue,
            ),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )
    except Exception as e:
        return jsonify({
            "error": "Video streaming failed",
            "details": str(e)
        }), 500


@app.route("/video/stop", methods=["POST"])
def stop_video_feed():
    payload = request.get_json(silent=True) or {}
    client_id = (payload.get("client_id") or "").strip()
    if client_id:
        ACTIVE_STREAMS[client_id] = ""
    return jsonify({"stopped": True, "client_id": client_id})


@app.route("/detected-images/<path:filename>")
def detected_images(filename):
    return send_from_directory(DETECTED_IMAGES_DIR, filename)


@app.route('/detections')
def detections():
    """
    Return all detections, grouped by license plate.
    """
    return jsonify(get_all_detections())


@app.route("/detections/<plate>", methods=["GET", "DELETE"])
def detections_for_plate(plate):
    """
    GET: Return detections for a specific license plate.
    DELETE: Clear detections for that plate and delete saved images.
    """
    if request.method == "GET":
        records = get_plate_detections(plate)
        print("records app.py", records)
        return jsonify(
            {
                "plate": plate.upper(),
                "detections": records,
            }
        )

    image_paths = clear_plate_detections(plate)

    deleted_files = 0
    for p in image_paths:
        # expected: /detected-images/<filename>
        filename = os.path.basename(p)
        if not filename:
            continue
        file_path = os.path.join(DETECTED_IMAGES_DIR, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
                deleted_files += 1
        except Exception:
            # best-effort delete; tracking data is already cleared
            pass

    return jsonify(
        {
            "plate": plate.upper(),
            "cleared": bool(image_paths),
            "deleted_images": deleted_files,
        }
    )


@app.route("/plates-to-detect", methods=["GET"])
def get_plates_to_detect():
    return jsonify({"number_pate_to_detect": get_number_plates_to_detect()})


@app.route("/plates-to-detect", methods=["POST"])
def add_plate_to_detect():
    payload = request.get_json(silent=True) or {}
    plate = payload.get("plate", "")
    updated = add_number_plate_to_detect(plate)
    return jsonify({"number_pate_to_detect": updated})


@app.route("/plates-to-detect/<plate>", methods=["DELETE"])
def delete_plate_to_detect(plate):
    updated = remove_number_plate_to_detect(plate)
    return jsonify({"number_pate_to_detect": updated})



# -------------------------------------------------
# ❌ 404 Error Handler
# -------------------------------------------------
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Route not found",
        "message": "Please check your URL"
    }), 404


# -------------------------------------------------
# ❌ 500 Error Handler
# -------------------------------------------------
@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal Server Error",
        "message": "Something went wrong on the server"
    }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)