import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";
import DetectionHoverCard from "./DetectionHoverCard";

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
  return (
    <div className="right-panel">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RouteArrows
          adjustedRoutesByPlate={adjustedRoutesByPlate}
          plateColorMap={plateColorMap}
        />
        {Object.entries(adjustedRoutesByPlate).map(([plateNumber, routeSteps]) => (
          <Polyline
            key={`route-${plateNumber}`}
            positions={routeSteps.map((step) => step.position)}
            color={plateColorMap[plateNumber] || "#2563eb"}
            weight={4}
          />
        ))}
        {adjustedMarkerGroups.map((group, groupIndex) => {
          const ordersText = group.visits.map((v) => v.order).join(", ");
          const plateColor = plateColorMap[group.plate] || "#2563eb";

          const icon = L.divIcon({
            className: "detection-marker",
            html: `<span class="detection-label" style="background:${plateColor}">${ordersText}</span>`,
          });

          return (
            <Marker
              key={groupIndex}
              position={[group.displayLat, group.displayLng]}
              icon={icon}
            >
              <Tooltip direction="top">
                <div style={{ textAlign: "left" }}>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
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
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
