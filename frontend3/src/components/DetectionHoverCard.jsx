export default function DetectionHoverCard({
  apiBaseUrl,
  plate,
  camera,
  visitOrder,
  detection,
  onImageClick,
}) {
  if (!detection) return null;

  const imageUrl = detection.image_path ? `${apiBaseUrl}${detection.image_path}` : null;
  const time = detection.timestamp
    ? new Date(detection.timestamp * 1000).toLocaleString()
    : "N/A";
  const coords =
    Number.isFinite(detection.lat) && Number.isFinite(detection.lng)
      ? `${detection.lat}, ${detection.lng}`
      : "N/A";

  const handleImageActivate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageUrl && typeof onImageClick === "function") onImageClick(imageUrl);
  };

  return (
    <div className="hover-card" onClick={(e) => e.stopPropagation()}>
      {imageUrl ? (
        <button
          type="button"
          onClick={handleImageActivate}
          onMouseDown={(e) => e.stopPropagation()}
          className="block p-0 border-0 bg-transparent cursor-zoom-in"
        >
          <img
            src={imageUrl}
            alt={`Detection ${visitOrder}`}
            className="w-44 h-auto rounded-lg border border-slate-600"
          />
        </button>
      ) : (
        <div className="text-sm text-slate-400 text-center py-6 px-2 rounded-lg border border-dashed border-slate-600/80 bg-slate-900/40">
          No image
        </div>
      )}
      <div className="hover-card-meta">
        <div>
          <span className="text-slate-500">Plate:</span> {plate}
        </div>
        <div>
          <span className="text-slate-500">Camera:</span> {camera || "N/A"}
        </div>
        <div>
          <span className="text-slate-500">Visit:</span> #{visitOrder}
        </div>
        <div>
          <span className="text-slate-500">Time:</span> {time}
        </div>
        <div>
          <span className="text-slate-500">Coordinates:</span> {coords}
        </div>
        <div>
          <span className="text-slate-500">Addr:</span> {detection.address || "N/A"}
        </div>
      </div>
    </div>
  );
}
