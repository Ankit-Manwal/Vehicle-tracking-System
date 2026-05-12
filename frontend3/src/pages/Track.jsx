import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "./Tracking.css";
import NumberPlateManager from "../components/NumberPlateManager";
import DetectionGallery from "../components/DetectionGallery";
import TrackingMap from "../components/TrackingMap";
import PageTransition from "../components/PageTransition";

const PLATE_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#7c3aed",
  "#f97316",
  "#0d9488",
  "#e11d48",
  "#4f46e5",
];

function Tracking() {
  const { plate } = useParams();
  const API_BASE_URL = "http://localhost:5000";
  const CLIENT_STREAM_ID = useMemo(
    () => `track-client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const [camera, setCamera] = useState(null);
  const [allDetections, setAllDetections] = useState({});
  const [platesToDetect, setPlatesToDetect] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [streamVersion, setStreamVersion] = useState(0);

  const fetchPlatesToDetect = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/plates-to-detect`);
      if (!res.ok) return;
      const data = await res.json();
      setPlatesToDetect(
        Array.isArray(data?.number_pate_to_detect)
          ? data.number_pate_to_detect
          : []
      );
    } catch (err) {
      console.error("Failed to fetch plates to detect", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDetections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/detections`);
        if (!res.ok) return;

        const data = await res.json();
        if (isMounted) {
          setAllDetections(data && typeof data === "object" ? data : {});
        }
      } catch (err) {
        console.error("Failed to fetch detections", err);
      }
    };

    fetchDetections();
    fetchPlatesToDetect();
    const intervalId = setInterval(() => {
      fetchDetections();
      fetchPlatesToDetect();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [plate]);

  useEffect(() => {
    const addCurrentRoutePlate = async () => {
      try {
        await fetch(`${API_BASE_URL}/plates-to-detect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plate }),
        });
        fetchPlatesToDetect();
      } catch (err) {
        console.error("Failed to add current route plate", err);
      }
    };

    if (plate) {
      addCurrentRoutePlate();
    }
  }, [plate]);

  const stopBackendStream = async () => {
    try {
      await fetch(`${API_BASE_URL}/video/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: CLIENT_STREAM_ID }),
      });
    } catch (err) {
      console.error("Failed to stop backend stream", err);
    }
  };

  const handleCameraClick = async (cam) => {
    if (camera === cam || isSwitchingCamera) return;

    // Stop previous backend stream first, then unmount local stream.
    setIsSwitchingCamera(true);
    await stopBackendStream();
    setCamera(null);

    // Start the newly selected camera after a short pause.
    window.setTimeout(() => {
      setStreamVersion((v) => v + 1);
      setCamera(cam);
      setIsSwitchingCamera(false);
    }, 250);
  };

  const handleStopAnalysis = async () => {
    if (!camera) return;
    setIsSwitchingCamera(true);
    await stopBackendStream();
    setCamera(null);
    setIsSwitchingCamera(false);
  };

  useEffect(() => {
    return () => {
      stopBackendStream();
    };
  }, []);

  const handleAddPlate = async (formatted) => {
    try {
      const res = await fetch(`${API_BASE_URL}/plates-to-detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate: formatted }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setPlatesToDetect(
        Array.isArray(data?.number_pate_to_detect)
          ? data.number_pate_to_detect
          : []
      );
    } catch (err) {
      console.error("Failed to add plate", err);
    }
  };

  const handleDeletePlate = async (targetPlate) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/plates-to-detect/${encodeURIComponent(targetPlate)}`,
        { method: "DELETE" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setPlatesToDetect(
        Array.isArray(data?.number_pate_to_detect)
          ? data.number_pate_to_detect
          : []
      );
    } catch (err) {
      console.error("Failed to delete plate", err);
    }
  };

  const handleClearTrackingDetails = async (plateToClear) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/detections/${encodeURIComponent(plateToClear)}`,
        { method: "DELETE" }
      );
      if (!res.ok) return;
      setAllDetections((prev) => {
        const next = { ...(prev || {}) };
        delete next[plateToClear];
        return next;
      });
    } catch (err) {
      console.error("Failed to clear tracking details", err);
    }
  };

  const plateEntries = useMemo(
    () =>
      Object.entries(allDetections).filter(
        ([, list]) => Array.isArray(list) && list.length > 0
      ),
    [allDetections]
  );

  const platesCurrentlyTracking = useMemo(
    () =>
      Array.isArray(platesToDetect)
        ? [...platesToDetect].filter(Boolean).sort((a, b) => a.localeCompare(b))
        : [],
    [platesToDetect]
  );

  const selectedPlateDetections = useMemo(() => {
    const list = allDetections?.[plate];
    return Array.isArray(list) ? list : [];
  }, [allDetections, plate]);

  const mapCenter = useMemo(() => {
    const lastSelected = selectedPlateDetections[selectedPlateDetections.length - 1];
    if (lastSelected && Number.isFinite(lastSelected.lat) && Number.isFinite(lastSelected.lng)) {
      return [lastSelected.lat, lastSelected.lng];
    }

    for (const [, list] of plateEntries) {
      const last = list[list.length - 1];
      if (last && Number.isFinite(last.lat) && Number.isFinite(last.lng)) {
        return [last.lat, last.lng];
      }
    }
    return [30.3165, 78.0322];
  }, [plateEntries, selectedPlateDetections]);

  const plateColorMap = useMemo(() => {
    const map = {};
    plateEntries.forEach(([plateNumber], index) => {
      map[plateNumber] = PLATE_COLORS[index % PLATE_COLORS.length];
    });
    return map;
  }, [plateEntries]);

  /** Color per queued plate: match map when we have detections, else stable index in queue. */
  const trackingPlateColors = useMemo(() => {
    const map = {};
    platesCurrentlyTracking.forEach((p, i) => {
      map[p] = plateColorMap[p] ?? PLATE_COLORS[i % PLATE_COLORS.length];
    });
    return map;
  }, [platesCurrentlyTracking, plateColorMap]);

  const markerGroups = useMemo(() => {
    const markers = [];

    plateEntries.forEach(([plateNumber, list]) => {
      list.forEach((d, index) => {
        markers.push({
          plate: plateNumber,
          camera: d.camera,
          lat: d.lat,
          lng: d.lng,
          visits: [
            {
              order: index + 1,
              detection: d,
            },
          ],
        });
      });
    });

    return markers;
  }, [plateEntries]);

  const adjustedMarkerGroups = useMemo(() => {
    const byLocation = {};

    markerGroups.forEach((group) => {
      if (!Number.isFinite(group.lat) || !Number.isFinite(group.lng)) return;
      const key = `${group.lat.toFixed(5)}:${group.lng.toFixed(5)}`;
      if (!byLocation[key]) {
        byLocation[key] = [];
      }
      byLocation[key].push(group);
    });

    const adjusted = [];
    Object.values(byLocation).forEach((sameSpotGroups) => {
      if (sameSpotGroups.length === 1) {
        adjusted.push({
          ...sameSpotGroups[0],
          displayLat: sameSpotGroups[0].lat,
          displayLng: sameSpotGroups[0].lng,
        });
        return;
      }

      // // Spread overlapping markers in a small circle around the original point.
      // const baseRadius = 0.00012;
      // Spread overlapping markers in a wider circle around the original point.
      const baseRadius = 0.00022;
      sameSpotGroups.forEach((group, index) => {
        const angle = (2 * Math.PI * index) / sameSpotGroups.length;
        const scale = 1 + Math.floor(index / 8) * 0.9;
        // const scale = 1 + Math.floor(index / 8) * 0.7;
        const offsetLat = Math.sin(angle) * baseRadius * scale;
        const offsetLng = Math.cos(angle) * baseRadius * scale;
        adjusted.push({
          ...group,
          displayLat: group.lat + offsetLat,
          displayLng: group.lng + offsetLng,
        });
      });
    });

    return adjusted;
  }, [markerGroups]);

  const adjustedRoutesByPlate = useMemo(() => {
    const routes = {};

    adjustedMarkerGroups.forEach((group) => {
      if (!routes[group.plate]) {
        routes[group.plate] = [];
      }
      const visitOrder = group.visits?.[0]?.order || 0;
      routes[group.plate].push({
        order: visitOrder,
        position: [group.displayLat, group.displayLng],
      });
    });

    Object.keys(routes).forEach((plateKey) => {
      routes[plateKey].sort((a, b) => a.order - b.order);
    });

    return routes;
  }, [adjustedMarkerGroups]);

  return (
    <PageTransition>
      <div className="tracking-wrapper">
        <div className="left-panel">
          <div className="track-header">
            <div>
              <h1>Live Tracking</h1>
              <div className="track-plate-badges-row">
                {platesCurrentlyTracking.length > 0 ? (
                  platesCurrentlyTracking.map((p) => (
                    <div
                      key={p}
                      className="track-plate-badge-item"
                      style={{ "--plate-accent": trackingPlateColors[p] }}
                    >
                      <span className="live-dot-plate" aria-hidden />
                      <span className="plate-text">{p}</span>
                    </div>
                  ))
                ) : (
                  <div className="track-plate-badge-item track-plate-badge-item--empty">
                    <span className="plate-text plate-text-muted">No plates in tracking queue</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="track-section glass-card">
            <NumberPlateManager
              title="Ongoing Detecting Plates AP05JEO GX15OGJ"
              plates={platesToDetect}
              onAddPlate={handleAddPlate}
              onDeletePlate={handleDeletePlate}
              addButtonLabel="Add"
            />
          </div>

          <div className="track-section glass-card">
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
              <button
                className="camera-btn stop-btn"
                onClick={handleStopAnalysis}
                disabled={!camera || isSwitchingCamera}
              >
                Stop Analysis
              </button>
            </div>

            {isSwitchingCamera ? (
              <div className="camera-switching">
                <div className="spinner" />
                <span>Switching camera, stopping previous analysis...</span>
              </div>
            ) : null}

            {camera && (
              <div className="video-wrapper animate-scale-in" key={camera}>
                <div className="live-tag">LIVE</div>
                <img
                  src={`${API_BASE_URL}/video?target_plate=${plate}&camera=${camera}&client_id=${encodeURIComponent(CLIENT_STREAM_ID)}&stream_id=${encodeURIComponent(`${camera}-${streamVersion}`)}`}
                  alt="Live Stream"
                  className="video-player"
                />
              </div>
            )}
          </div>

          <div className="track-section glass-card">
            <DetectionGallery
              plateEntries={plateEntries}
              plateColorMap={plateColorMap}
              apiBaseUrl={API_BASE_URL}
              onImageClick={setSelectedImageUrl}
              onClearPlate={handleClearTrackingDetails}
            />
          </div>
        </div>

        <TrackingMap
          mapCenter={mapCenter}
          adjustedRoutesByPlate={adjustedRoutesByPlate}
          plateColorMap={plateColorMap}
          adjustedMarkerGroups={adjustedMarkerGroups}
          apiBaseUrl={API_BASE_URL}
          onImageClick={setSelectedImageUrl}
        />

        {selectedImageUrl ? (
          <div className="image-modal-backdrop" onClick={() => setSelectedImageUrl("")}>
            <img
              src={selectedImageUrl}
              alt="Enlarged detection"
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}

export default Tracking;