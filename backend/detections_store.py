from collections import defaultdict
from typing import Dict, List, Any


_detections: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
# Plates that should be actively tracked while video analysis is running.
# Data structure format:
# number_pate_to_detect = ["AB12CDE", "DL01EFG", "UK07AAA"]
number_pate_to_detect: List[str] = []


def get_number_plates_to_detect() -> List[str]:
    return list(number_pate_to_detect)


def add_number_plate_to_detect(plate: str) -> List[str]:
    if not plate:
        return get_number_plates_to_detect()

    plate_key = plate.strip().upper()
    if not plate_key:
        return get_number_plates_to_detect()

    if plate_key not in number_pate_to_detect:
        number_pate_to_detect.append(plate_key)

    return get_number_plates_to_detect()


def remove_number_plate_to_detect(plate: str) -> List[str]:
    if not plate:
        return get_number_plates_to_detect()

    plate_key = plate.strip().upper()
    if plate_key in number_pate_to_detect:
        number_pate_to_detect.remove(plate_key)

    return get_number_plates_to_detect()


def should_add_detection(plate: str, camera: str) -> bool:
    """
    Return True when this detection should be recorded.
    """
    if not plate or not camera:
        return False

    plate_key = plate.strip().upper()
    history = _detections[plate_key]
    return not (history and history[-1].get("camera") == camera)


def add_detection(
    plate: str,
    camera: str,
    lat: float,
    lng: float,
    address: str,
    timestamp: int,
    image_path: str = "",
) -> bool:
    """
    Append a detection for a given plate, keeping the order in which
    detections arrive and preventing duplicate consecutive detections
    from the same camera.

    Detection store data structure format:
    {
      "PLATE123": [
        {
          "camera": "cam1",
          "lat": 30.3165,
          "lng": 78.0322,
          "address": "Clock Tower, Dehradun",
          "timestamp": 1714579200,
          "image_path": "/detected-images/PLATE123_cam1_1714579200.jpg"
        }
      ]
    }
    """
    if not should_add_detection(plate, camera):
        return False

    plate_key = plate.strip().upper()
    history = _detections[plate_key]

    history.append(
        {
            "camera": camera,
            "lat": float(lat),
            "lng": float(lng),
            "address": address,
            "timestamp": int(timestamp),
            "image_path": image_path or "",
        }
    )
    return True


def get_all_detections() -> Dict[str, List[Dict[str, Any]]]:
    """
    Return all detections grouped by plate.
    """
    return dict(_detections)


def get_plate_detections(plate: str) -> List[Dict[str, Any]]:
    """
    Return detections for a specific plate (or an empty list).
    """
    if not plate:
        return []
    plate_key = plate.strip().upper()
    return list(_detections.get(plate_key, []))


def clear_plate_detections(plate: str) -> List[str]:
    """
    Clear all stored detections for a specific plate.
    Returns list of image_path values that were cleared.
    """
    if not plate:
        return []
    plate_key = plate.strip().upper()
    if plate_key in _detections:
        records = _detections.pop(plate_key, [])
        image_paths: List[str] = []
        for r in records:
            p = r.get("image_path") if isinstance(r, dict) else None
            if p:
                image_paths.append(str(p))
        return image_paths
    return []

