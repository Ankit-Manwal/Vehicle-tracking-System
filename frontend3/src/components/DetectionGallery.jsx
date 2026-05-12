export default function DetectionGallery({
  plateEntries,
  plateColorMap,
  apiBaseUrl,
  onImageClick,
  onClearPlate,
}) {
  return (
    <div className="detection-gallery-wrapper">
      <h3>Detected Frames (Analyzed)</h3>
      {plateEntries.length === 0 ? (
        <p className="detection-empty">No detections yet.</p>
      ) : (
        plateEntries.map(([plateNumber, list]) => {
          const ordered = [...list].sort(
            (a, b) => (a?.timestamp || 0) - (b?.timestamp || 0)
          );
          return (
            <div className="plate-gallery-block" key={plateNumber}>
              <div className="plate-gallery-header">
                <h4 style={{ color: plateColorMap[plateNumber] || "#93c5fd", margin: 0 }}>
                  {plateNumber}
                </h4>
                <button
                  type="button"
                  onClick={() => onClearPlate && onClearPlate(plateNumber)}
                  className="clear-btn"
                  title={`Clear tracking details for ${plateNumber}`}
                >
                  Clear
                </button>
              </div>
              <div className="detection-gallery-grid">
                {ordered.map((d, index) => (
                  <button
                    key={`${plateNumber}-${d.timestamp || index}-${index}`}
                    type="button"
                    className="detection-thumb-btn"
                    onClick={() => d.image_path && onImageClick(`${apiBaseUrl}${d.image_path}`)}
                  >
                    {d.image_path ? (
                      <img
                        src={`${apiBaseUrl}${d.image_path}`}
                        alt={`${plateNumber} detection ${index + 1}`}
                        className="detection-thumb-image"
                      />
                    ) : (
                      <div className="detection-thumb-missing">No image</div>
                    )}
                    {/* <span className="detection-thumb-meta">
                      #{index + 1}{" "}
                      {d.timestamp
                        ? new Date(d.timestamp * 1000).toLocaleTimeString()
                        : "N/A"}
                    </span> */}
                    <div className="detection-thumb-meta">
                      <div>
                        <strong>Plate:</strong> {plateNumber}
                      </div>
                      <div>
                        <strong>Camera:</strong> {d.camera || "N/A"}
                      </div>
                      <div>
                        <strong>Visit:</strong> #{index + 1}
                      </div>
                      <div>
                        <strong>Time:</strong>{" "}
                        {d.timestamp
                          ? new Date(d.timestamp * 1000).toLocaleString()
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Address:</strong> {d.address || "N/A"}
                      </div>
                      <div>
                        <strong>Coordinates:</strong>{" "}
                        {Number.isFinite(d.lat) && Number.isFinite(d.lng)
                          ? `${d.lat}, ${d.lng}`
                          : "N/A"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
