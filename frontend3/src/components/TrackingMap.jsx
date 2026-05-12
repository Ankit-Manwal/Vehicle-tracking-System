import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";
import DetectionHoverCard from "./DetectionHoverCard";

function MarkerDetectionPanel({ group, apiBaseUrl, onImageClick }) {
  return (
    <div className="map-marker-detection-panel" onClick={(e) => e.stopPropagation()}>
      <ul className="map-marker-detection-list">
        {group.visits.map((v) => (
          <li key={v.order}>
            <DetectionHoverCard
              apiBaseUrl={apiBaseUrl}
              plate={group.plate}
              camera={group.camera}
              visitOrder={v.order}
              detection={v.detection}
              onImageClick={onImageClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FitFilteredBounds({ routesByPlate, selectionKey }) {
  const map = useMap();
  const fittedForSelectionKey = useRef(null);

  useEffect(() => {
    const latlngs = [];
    Object.values(routesByPlate).forEach((steps) => {
      steps.forEach((s) => {
        if (Array.isArray(s.position) && s.position.length >= 2) {
          latlngs.push(s.position);
        }
      });
    });
    if (latlngs.length === 0) return;

    if (fittedForSelectionKey.current === selectionKey) return;
    fittedForSelectionKey.current = selectionKey;

    if (latlngs.length === 1) {
      map.setView(latlngs[0], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(latlngs), { padding: [48, 48], maxZoom: 16 });
  }, [map, routesByPlate, selectionKey]);

  return null;
}

function RouteArrows({ adjustedRoutesByPlate, plateColorMap }) {
  const map = useMap();

  const routeLines = useMemo(() => {
    return Object.entries(adjustedRoutesByPlate)
      .map(([plateNumber, steps]) => {
        const latLngs = steps.map((s) => s.position);
        return { plateNumber, latLngs };
      })
      .filter((r) => r.latLngs.length >= 2);
  }, [adjustedRoutesByPlate]);

  useEffect(() => {
    if (!map) return;

    const decorators = routeLines.map(({ plateNumber, latLngs }) => {
      const color = plateColorMap[plateNumber] || "#2563eb";
      const polyline = L.polyline(latLngs);

      // Arrow heads along the line, repeated.
      return L.polylineDecorator(polyline, {
        patterns: [
          {
            offset: 20,
            repeat: 60,
            symbol: L.Symbol.arrowHead({
              pixelSize: 10,
              polygon: false,
              pathOptions: { stroke: true, color, weight: 2, opacity: 0.9 },
            }),
          },
        ],
      }).addTo(map);
    });

    return () => {
      decorators.forEach((d) => d.remove());
    };
  }, [map, plateColorMap, routeLines]);

  return null;
}

export default function TrackingMap({
  mapCenter,
  adjustedRoutesByPlate,
  plateColorMap,
  adjustedMarkerGroups,
  apiBaseUrl,
  onImageClick,
}) {
  /** Plates whose track is turned off (not drawn). Empty = every plate is shown. */
  const [hiddenPlates, setHiddenPlates] = useState(() => new Set());

  const trackedPlates = useMemo(
    () => Object.keys(adjustedRoutesByPlate || {}).sort(),
    [adjustedRoutesByPlate]
  );

  useEffect(() => {
    const keys = new Set(Object.keys(adjustedRoutesByPlate || {}));
    setHiddenPlates((prev) => {
      const next = new Set([...prev].filter((p) => keys.has(p)));
      if (next.size === prev.size && [...next].every((p) => prev.has(p))) return prev;
      return next;
    });
  }, [adjustedRoutesByPlate]);

  const visibleRoutesByPlate = useMemo(() => {
    const out = {};
    Object.entries(adjustedRoutesByPlate || {}).forEach(([plateNumber, steps]) => {
      if (!hiddenPlates.has(plateNumber)) out[plateNumber] = steps;
    });
    return out;
  }, [adjustedRoutesByPlate, hiddenPlates]);

  const visibleMarkerGroups = useMemo(
    () => adjustedMarkerGroups.filter((g) => !hiddenPlates.has(g.plate)),
    [adjustedMarkerGroups, hiddenPlates]
  );

  const togglePlateTrack = useCallback((plateNumber) => {
    setHiddenPlates((prev) => {
      const next = new Set(prev);
      if (next.has(plateNumber)) next.delete(plateNumber);
      else next.add(plateNumber);
      return next;
    });
  }, []);

  const showEveryTrack = hiddenPlates.size === 0;

  const filterSelectionKey = useMemo(
    () => [...hiddenPlates].sort().join("|"),
    [hiddenPlates]
  );

  return (
    <div className="right-panel">
      {trackedPlates.length > 0 ? (
        <div className="map-plate-toolbar" role="toolbar" aria-label="Toggle tracks by plate">
          <span className="map-plate-toolbar-label">Tracks</span>
          <button
            type="button"
            className={`map-plate-chip map-plate-chip-all ${showEveryTrack ? "active" : ""}`}
            onClick={() => setHiddenPlates(new Set())}
            aria-pressed={showEveryTrack}
            title="Show every plate track on the map"
          >
            All plates
          </button>
          {trackedPlates.map((plateNumber) => {
            const color = plateColorMap[plateNumber] || "#2563eb";
            const isShown = !hiddenPlates.has(plateNumber);
            return (
              <button
                key={plateNumber}
                type="button"
                className={`map-plate-chip ${isShown ? "active" : "plate-chip-off"} ${showEveryTrack ? "all-mode" : ""}`}
                style={{ "--plate-color": color }}
                onClick={() => togglePlateTrack(plateNumber)}
                aria-pressed={isShown}
                title="Click to show or hide this plate's track. Combine several by leaving multiple on."
              >
                {plateNumber}
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="map-frame">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {!showEveryTrack ? (
          <FitFilteredBounds
            routesByPlate={visibleRoutesByPlate}
            selectionKey={filterSelectionKey}
          />
        ) : null}
        <RouteArrows
          adjustedRoutesByPlate={visibleRoutesByPlate}
          plateColorMap={plateColorMap}
        />
        {Object.entries(visibleRoutesByPlate).map(([plateNumber, routeSteps]) => (
          <Polyline
            key={`route-${plateNumber}`}
            positions={routeSteps.map((step) => step.position)}
            color={plateColorMap[plateNumber] || "#2563eb"}
            weight={4}
          />
        ))}
        {visibleMarkerGroups.map((group) => {
          const ordersText = group.visits.map((v) => v.order).join(", ");
          const plateColor = plateColorMap[group.plate] || "#2563eb";
          const markerKey = `${group.plate}-${group.camera}-${ordersText}-${group.displayLat}-${group.displayLng}`;

          const icon = L.divIcon({
            className: "detection-marker",
            html: `<span class="detection-label" style="background:${plateColor}">${ordersText}</span>`,
          });

          return (
            <Marker
              key={markerKey}
              position={[group.displayLat, group.displayLng]}
              icon={icon}
            >
              <Tooltip
                direction="top"
                interactive
                opacity={1}
                className="map-detection-map-overlay"
              >
                <MarkerDetectionPanel
                  group={group}
                  apiBaseUrl={apiBaseUrl}
                  onImageClick={onImageClick}
                />
              </Tooltip>
              <Popup closeButton className="map-detection-map-overlay" maxWidth={280}   >
                <MarkerDetectionPanel
                  group={group}
                  apiBaseUrl={apiBaseUrl}
                  onImageClick={onImageClick}
                />
              </Popup>
            </Marker>
          );
        })}
        </MapContainer>
      </div>
    </div>
  );
}
