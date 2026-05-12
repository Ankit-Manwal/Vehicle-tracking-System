import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NumberPlateManager from "../components/NumberPlateManager"

export default function TrackSearch() {
  const API_BASE_URL = "http://localhost:5000"
  const [selectedPlate, setSelectedPlate] = useState("")
  const [platesToDetect, setPlatesToDetect] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchPlates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/plates-to-detect`)
      if (!res.ok) return
      const data = await res.json()
      const list = Array.isArray(data?.number_pate_to_detect) ? data.number_pate_to_detect : []
      setPlatesToDetect(list)
      if (!selectedPlate && list.length) setSelectedPlate(list[0])
    } catch (err) {
      console.error(err)
      setError("Failed to fetch plates from server.")
    }
  }

  useEffect(() => {
    fetchPlates()
  }, [])

  const handleAddPlate = async (formatted) => {
    setError("")
    try {
      const res = await fetch(`${API_BASE_URL}/plates-to-detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate: formatted }),
      })
      if (!res.ok) {
        setError("Failed to add plate. Server error.")
        return
      }
      const data = await res.json()
      const list = Array.isArray(data?.number_pate_to_detect) ? data.number_pate_to_detect : []
      setPlatesToDetect(list)
      setSelectedPlate(formatted)
    } catch (err) {
      console.error(err)
      setError("Failed to add plate. Is backend running?")
    }
  }

  const handleDeletePlate = async (plateToDelete) => {
    setError("")
    try {
      const res = await fetch(`${API_BASE_URL}/plates-to-detect/${encodeURIComponent(plateToDelete)}`, { method: "DELETE" })
      if (!res.ok) {
        setError("Failed to delete plate.")
        return
      }
      const data = await res.json()
      const list = Array.isArray(data?.number_pate_to_detect) ? data.number_pate_to_detect : []
      setPlatesToDetect(list)
      if (selectedPlate === plateToDelete) setSelectedPlate(list[0] || "")
    } catch (err) {
      console.error(err)
      setError("Failed to delete plate. Is backend running?")
    }
  }

  const handleTrack = () => {
    const plateToTrack = selectedPlate || (platesToDetect[0] || "")
    if (!plateToTrack) {
      setError("Add at least one vehicle number before tracking.")
      return
    }
    navigate(`/track/${plateToTrack}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Track <span className="text-purple-300">Vehicles</span></h1>
          <p className="text-gray-500 text-xs mt-1">Add plates and start real-time tracking</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#12121a] border border-white/[0.06]">
          <NumberPlateManager
            title="Number Plates to Detect"
            plates={platesToDetect}
            selectedPlate={selectedPlate}
            onSelectPlate={setSelectedPlate}
            onAddPlate={handleAddPlate}
            onDeletePlate={handleDeletePlate}
            addButtonLabel="Add"
          />

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Quick add:</span>
            {["GX15OGJ", "HR26DK8337", "UP16AB1234", "DL8CAF5032"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  if (platesToDetect.includes(p)) {
                    setSelectedPlate(p)
                  } else {
                    handleAddPlate(p)
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 hover:bg-white/10 hover:border-purple-500/30 transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {platesToDetect.length > 0 && !selectedPlate && (
            <div className="mb-4 p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
              <p className="text-xs text-gray-400">
                Click on a plate above to select it for tracking, then press Start Tracking.
              </p>
            </div>
          )}

          {selectedPlate && (
            <div className="mb-4 p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
              <p className="text-xs text-gray-400">
                Selected: <span className="text-purple-300 font-mono font-semibold">{selectedPlate}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleTrack}
            className="w-full py-3.5 rounded-2xl bg-purple-400 hover:bg-purple-300 text-black font-semibold transition-all active:scale-95"
          >
            Start Tracking
          </button>
        </div>
      </div>
    </div>
  )
}
