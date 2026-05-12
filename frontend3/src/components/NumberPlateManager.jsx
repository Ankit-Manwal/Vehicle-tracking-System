import { useState } from "react"

export default function NumberPlateManager({
  title = "Add Number Plates",
  plates = [],
  selectedPlate = "",
  onSelectPlate,
  onAddPlate,
  onDeletePlate,
  addButtonLabel = "Add",
}) {
  const [newPlate, setNewPlate] = useState("")

  const handleAdd = async () => {
    const formatted = newPlate.trim().toUpperCase()
    if (!formatted) { alert("Enter vehicle number"); return }
    await onAddPlate(formatted)
    setNewPlate("")
  }

  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{title}</h4>
      <div className="flex gap-2 mb-4">
        <input
          value={newPlate}
          onChange={(e) => setNewPlate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add plate number"
          className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a24] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40 text-sm uppercase"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-semibold text-sm transition-all active:scale-95"
        >
          {addButtonLabel}
        </button>
      </div>

      {plates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {plates.map((p) => {
            const isSelected = selectedPlate && selectedPlate === p
            return (
              <button
                key={p}
                onClick={() => onSelectPlate && onSelectPlate(p)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:border-white/20"
                }`}
              >
                <span>{p}</span>
                <span
                  onClick={(e) => { e.stopPropagation(); onDeletePlate(p) }}
                  className="text-red-400 hover:text-red-300 text-[10px] w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/10 transition-colors"
                  title={`Delete ${p}`}
                >
                  ✕
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
