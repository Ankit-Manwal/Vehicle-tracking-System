export default function DetectionHoverCard({
  apiBaseUrl,
  plate,
  camera,
  visitOrder,
  detection,
  onImageClick,
}) {
  if (!detection?.image_path) return null;

  const imageUrl = `${apiBaseUrl}${detection.image_path}`;
  const formattedTime = detection.timestamp
    ? new Date(detection.timestamp * 1000).toLocaleString()
    : "N/A";

  return (
    <div style={{ marginTop: 6 }}>
      <button
        type="button"
        onClick={() => onImageClick(imageUrl)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "zoom-in",
        }}
      >
        <img
          src={imageUrl}
          alt={`Detection ${visitOrder}`}
          style={{
            width: 180,
            height: "auto",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
          }}
        />
      </button>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          lineHeight: 1.4,
          color: "#334155",
          background: "#f8fafc",
          border: "1px solid #cbd5e1",
          borderRadius: 6,
          padding: "6px 8px",
        }}
      >
        <div>
          <strong>Plate:</strong> {plate}
        </div>
        <div>
          <strong>Camera:</strong> {camera || "N/A"}
        </div>
        <div>
          <strong>Visit:</strong> #{visitOrder}
        </div>
        <div>
          <strong>Time:</strong> {formattedTime}
        </div>
        <div>
          <strong>Address:</strong> {detection.address || "N/A"}
        </div>
        <div>
          <strong>Coordinates:</strong>{" "}
          {Number.isFinite(detection.lat) && Number.isFinite(detection.lng)
            ? `${detection.lat}, ${detection.lng}`
            : "N/A"}
        </div>
      </div>
    </div>
  );
}
