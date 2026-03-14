from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from number_plate_detection_training_Resources import ocr
from detections_store import get_all_detections, get_plate_detections

app = Flask(__name__)

# Allow React frontend
CORS(app)

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store"
    return response
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
    try:
        return Response(
            ocr.generate_frames(
                target_plate=target_plate,
                camera_id=camera_id,
            ),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )
    except Exception as e:
        return jsonify({
            "error": "Video streaming failed",
            "details": str(e)
        }), 500


@app.route('/detections')
def detections():
    """
    Return all detections, grouped by license plate.
    """
    return jsonify(get_all_detections())


@app.route('/detections/<plate>')
def detections_for_plate(plate):
    """
    Return detections for a specific license plate.
    """
    records = get_plate_detections(plate)
    print("records app.py", records)
    return jsonify({
        "plate": plate.upper(),
        "detections": records,
    })



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