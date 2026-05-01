# Vehicle Tracking System

Vehicle Tracking System is a full-stack application that detects license plates from video, stores vehicle detection events by camera, and visualizes the vehicle route on a map in detection order.

## Features

- License plate detection and OCR pipeline using YOLO + EasyOCR.
- Track detections per vehicle (license plate) with timestamped history.
- Camera metadata management (latitude, longitude, address).
- Detection APIs for all vehicles and individual plate history.
- React + Leaflet map route visualization using backend detection order.
- Repeated detections at the same camera are preserved as visit history.

## Technologies Used

### Backend

- Python
- Flask
- Flask-CORS
- OpenCV (`opencv-python`)
- Ultralytics YOLO (`ultralytics`)
- PyTorch (`torch`)
- EasyOCR (`easyocr` expected; verify dependency file spelling)

### Frontend

- React
- React Router
- Vite
- Leaflet + React Leaflet
- Axios
- CSS

## Project Structure

```text
Vehicle-tracking-System/
|-- backend/
|   |-- app.py
|   |-- cameras.py
|   |-- detections_store.py
|   |-- requirements.txt
|   `-- number_plate_detection_training_Resources/
|       |-- __init__.py
|       |-- ocr.py
|       |-- saved_models/
|       |-- test_images_and_videos/
|       `-- runs/
|
|-- frontend/
|   |-- package.json
|   |-- index.html
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- styles.css
|   |   `-- pages/
|   |       |-- Home.jsx
|   |       |-- Details.jsx
|   |       |-- Tracking.jsx
|   |       `-- Tracking.css
|   `-- vite.config.js
|
`-- README.md
```

## How It Works

1. Backend video pipeline (`ocr.py`) reads frames from input video.
2. YOLO detects number plate regions.
3. EasyOCR extracts plate text and stabilization logic selects stable output.
4. For detected plates, camera metadata is looked up from `cameras.py`.
5. Detection events are stored in-memory by `detections_store.py`.
6. Frontend calls detection endpoints and draws route points in order on Leaflet map.

## API Endpoints

Base URL: `http://127.0.0.1:5000`

- `GET /`
  - Service info and listed endpoints.

- `GET /health`
  - Health check.

- `GET /video?target_plate=<PLATE>&camera=<CAM_ID>`
  - MJPEG stream with detection overlay.
  - `camera` should be one of: `cam1`, `cam2`, `cam3`, `cam4`.

- `GET /detections`
  - Returns all stored detections grouped by plate.

- `GET /detections/<plate>`
  - Returns detections for one plate in the order they occurred.

### Example detection response

```json
{
  "plate": "UK07AB1234",
  "detections": [
    {
      "camera": "cam1",
      "lat": 30.3165,
      "lng": 78.0322,
      "address": "Clock Tower, Dehradun",
      "timestamp": 1710412100
    },
    {
      "camera": "cam3",
      "lat": 30.325,
      "lng": 78.05,
      "address": "ISBT Dehradun",
      "timestamp": 1710412120
    }
  ]
}
```

## Setup and Run

## 1) Clone repository

```bash
git clone <your-repo-url>
cd Vehicle-tracking-System
```

## 2) Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask run
```

Backend runs on `http://127.0.0.1:5000`.

## 3) Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend typically runs on Vite default URL shown in terminal.

## Notes

- Detection storage is currently in-memory (`detections_store.py`), so data resets when backend restarts.
- Ensure model files and test video paths in `ocr.py` are available on your machine.
- If backend does not record detections, verify `camera` query param values exactly match camera IDs in `cameras.py`.

## Future Improvements

- Persist detections to a database (SQLite/PostgreSQL/MongoDB).
- Add authentication and role-based access.
- Support live camera feeds instead of static test video.
- Add unit/integration tests for detection APIs.
- Containerize with Docker for easier deployment.