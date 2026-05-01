import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Tracking.css";

function Tracking() {
  const { plate } = useParams();

  const [camera, setCamera] = useState(null);
  const [route, setRoute] = useState([]);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDetections = async () => {
      try {
        const res = await fetch(`http://localhost:5000/detections/${plate}`);
        if (!res.ok) return;

        const data = await res.json();
        const list = Array.isArray(data?.detections) ? data.detections : [];

        const positions = list.map((d) => [d.lat, d.lng]);

        if (isMounted) {
          setDetections(list);
          setRoute((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(positions)) {
              return prev;
            }
            return positions;
          });
        }
      } catch (err) {
        console.error("Failed to fetch detections", err);
      }
    };

    fetchDetections();
    const intervalId = setInterval(fetchDetections, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [plate]);

  const handleCameraClick = (cam) => {
    setCamera(cam);
  };

  // Group detections by camera (place) so that
  // if the vehicle is detected again at the same camera,
  // we keep all visit order numbers instead of overwriting.
  const groupedDetections = useMemo(() => {
    const groups = {};

    detections.forEach((d, index) => {
      const key = d.camera || `${d.lat}-${d.lng}`;

      if (!groups[key]) {
        groups[key] = {
          camera: d.camera,
          lat: d.lat,
          lng: d.lng,
          visits: [],
        };
      }

      groups[key].visits.push({
        order: index + 1, // 1-based global order
        detection: d,
      });
    });

    return Object.values(groups);
  }, [detections]);

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

        {camera && (
          <img
            key={camera}
            src={`http://localhost:5000/video?target_plate=${plate}&camera=${camera}`}
            alt="Live Stream"
            className="video-player"
          />
        )}
      </div>

      <div className="right-panel">
        <MapContainer
          center={route.length ? route[route.length - 1] : [30.3165, 78.0322]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={route} color="blue" />
          {groupedDetections.map((group, groupIndex) => {
            const ordersText = group.visits.map((v) => v.order).join(", ");

            const icon = L.divIcon({
              className: "detection-marker",
              html: `<span class="detection-label">${ordersText}</span>`,
            });

            return (
              <Marker
                key={groupIndex}
                position={[group.lat, group.lng]}
                icon={icon}
              >
                <Tooltip direction="top">
                  <div style={{ textAlign: "left" }}>
                    <div>
                      <strong>Camera: {group.camera}</strong>
                    </div>
                    <div>Plate: {plate}</div>
                    <div>Visits:</div>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {group.visits.map((v) => (
                        <li key={v.order}>
                          #{v.order} –{" "}
                          {v.detection.timestamp
                            ? new Date(
                                v.detection.timestamp * 1000
                              ).toLocaleString()
                            : "N/A"}
                          {v.detection.address
                            ? ` – ${v.detection.address}`
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default Tracking;