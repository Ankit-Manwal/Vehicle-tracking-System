import { useParams } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Tracking() {
  const { plate } = useParams();

  const cameraCoordinates = {
    cam1: [30.3165, 78.0322],
    cam2: [30.3200, 78.0400],
    cam3: [30.3250, 78.0500],
    cam4: [30.3300, 78.0600],
  };

  const cameraVideos = {
    cam1: "",
    cam2: "",
    cam3: "",
    cam4: "",
  };

  const [camera, setCamera] = useState(null);
  const [visited, setVisited] = useState([]);
  const [route, setRoute] = useState([]);

  const handleCameraClick = (cam) => {
    setCamera(cam);

    if (visited.includes(cam)) return;

    setVisited([...visited, cam]);
    setRoute([...route, cameraCoordinates[cam]]);
  };

  return (
    <div className="tracking-wrapper">

      <div className="left-panel">
        <h2>Tracking: {plate}</h2>

        <div className="camera-bar">
          {["cam1", "cam2", "cam3", "cam4"].map((cam, index) => (
            <button
              key={cam}
              onClick={() => handleCameraClick(cam)}
              className={`camera-btn ${camera === cam ? "active" : ""}`}
            >
              Camera {index + 1}
            </button>
          ))}
        </div>
{/* 
        {camera && (
          <video
            src={cameraVideos[camera]}
            controls
            autoPlay
            className="video-player"
          />
        )} */}
        {camera && (
          <img
            src={`http://localhost:5000/video?target_plate=${plate}`}
            alt="Live Stream"
            className="video-player"
          />
        )}
      </div>

      <div className="right-panel">
        <MapContainer
          center={[30.3165, 78.0322]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={route} color="blue" />
          {route.map((pos, i) => (
            <Marker key={i} position={pos} />
          ))}
        </MapContainer>
      </div>

    </div>
  );
}

export default Tracking;