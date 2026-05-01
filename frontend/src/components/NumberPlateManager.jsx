import { useState } from "react";

export default function NumberPlateManager({
  title = "Add Number Plates For Detection",
  plates = [],
  selectedPlate = "",
  onSelectPlate,
  onAddPlate,
  onDeletePlate,
  addButtonLabel = "Add",
}) {
  const [newPlate, setNewPlate] = useState();

  const handleAdd = async () => {
    const formatted = newPlate.trim().toUpperCase();
    if (!formatted) {
      alert("Enter vehicle number");
      return;
    }
    await onAddPlate(formatted);
    setNewPlate("");
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <h4 style={{ marginBottom: 8 }}>{title}</h4>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={newPlate}
          onChange={(e) => setNewPlate(e.target.value)}
          placeholder="Add number plate"
          style={{
            flex: 1,
            borderRadius: 6,
            border: "1px solid #94a3b8",
            padding: "8px 10px",
            color: "#111827",
          }}
        />
        <button className="camera-btn active" onClick={handleAdd}>
          {addButtonLabel}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {plates.map((p) => {
          const isSelected = selectedPlate && selectedPlate === p;
          return (
            <span
              key={p}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: isSelected ? "#1d4ed8" : "#334155",
                borderRadius: 999,
                padding: "4px 10px",
                border: isSelected ? "1px solid #60a5fa" : "1px solid transparent",
              }}
            >
              <button
                onClick={() => onSelectPlate && onSelectPlate(p)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "white",
                  cursor: onSelectPlate ? "pointer" : "default",
                  fontWeight: 700,
                }}
              >
                {p}
              </button>
              <button
                onClick={() => onDeletePlate(p)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fca5a5",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                title={`Delete ${p}`}
              >
                x
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
