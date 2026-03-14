from collections import defaultdict
from typing import Dict, List, Any


_detections: Dict[str, List[Dict[str, Any]]] = defaultdict(list)


def add_detection(plate: str, camera: str, lat: float, lng: float, address: str, timestamp: int) -> None:
    """
    Append a detection for a given plate, keeping the order in which
    detections arrive and preventing duplicate consecutive detections
    from the same camera.
    """
    if not plate or not camera:
        return

    plate_key = plate.strip().upper()
    history = _detections[plate_key]

    # Prevent duplicate consecutive detections from the same camera
    if history and history[-1].get("camera") == camera:
        return

    history.append(
        {
            "camera": camera,
            "lat": float(lat),
            "lng": float(lng),
            "address": address,
            "timestamp": int(timestamp),
        }
    )


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

