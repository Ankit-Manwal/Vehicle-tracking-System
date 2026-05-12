import { useState, useEffect } from "react"
import { getVehicle } from "../services/api"
import { useSearchParams } from "react-router-dom"

// Build full details from backend data, with deterministic fallbacks
function buildDetails(data) {
  const plate = data.plate || ""
  const hash = plate.split("").reduce((a, c) => a + c.charCodeAt(0), 0)

  const names = data.owner?.split(" ") || ["Rahul", "Sharma"]
  const firstName = names[0] || "Rahul"
  const lastName = names[1] || "Sharma"

  const models = [
    "Royal Enfield Classic 350",
    "Honda City ZX",
    "Maruti Swift Dzire",
    "Hyundai Creta SX",
    "Toyota Innova Crysta",
    "BMW X1 sDrive",
    "KTM Duke 390",
    "Honda Activa 6G",
    "Tata LPT 1613",
    "Ashok Leyland Boss",
  ]
  const colors = [
    "Red",
    "Silver Metallic",
    "Magma Grey",
    "Phantom Black",
    "Bronze",
    "Black Sapphire",
    "Orange",
    "Pearl White",
    "Sky Blue",
    "Yellow",
  ]
  const dates = [
    "28 Aug 2017",
    "15 Mar 2019",
    "03 Jan 2018",
    "22 Sep 2020",
    "10 Nov 2016",
    "14 Jul 2021",
    "05 May 2015",
    "19 Oct 2023",
    "11 Feb 2022",
    "25 Dec 2014",
  ]

  const fallbackDocs = [
    {
      name: "Pollution Certificate",
      status: hash % 2 === 0 ? "Expired 622d ago" : "Active",
      expired: hash % 2 === 0,
    },
    {
      name: "Insurance",
      status: hash % 3 === 0 ? "Expired 1414d ago" : "Active",
      expired: hash % 3 === 0,
    },
  ]

  const reasons = [
    "Triple riding",
    "Rash driving",
    "No seatbelt",
    "Expired PUC",
    "Speeding",
    "No helmet",
    "Wrong parking",
    "Overloading",
  ]
  const amounts = ["500", "1000", "1500", "2000", "5000", "10000", "20000"]
  const fallbackChallans = Array.from({ length: 2 + (hash % 4) }, (_, i) => ({
    reason: reasons[(hash + i) % reasons.length],
    date: dates[(hash + i) % dates.length],
    amount: amounts[(hash + i) % amounts.length],
    paid: (hash + i) % 2 === 0,
  }))

  const model = data.model || models[hash % models.length]
  const color = data.color || colors[hash % colors.length]
  const chassis =
    data.chassis || `MBJXD3R8${100000000 + (hash % 900000000)}`
  const regDate = data.regDate || dates[hash % dates.length]
  const phone =
    data.phone || `+91-${90000 + (hash % 9999)} ${10000 + (hash % 8999)}`

  return {
    ...data,
    model,
    color,
    chassis,
    regDate,
    firstName,
    lastName,
    phone,
    documents:
      Array.isArray(data.documents) && data.documents.length > 0
        ? data.documents
        : fallbackDocs,
    challans:
      Array.isArray(data.challans) && data.challans.length > 0
        ? data.challans
        : fallbackChallans,
  }
}

export default function GetVehicle() {
  const [searchParams] = useSearchParams()
  const [plate, setPlate] = useState("")
  const [vehicle, setVehicle] = useState(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [autoSearched, setAutoSearched] = useState(false)

  // Auto-search from query param ?plate=XXX
  useEffect(() => {
    const qPlate = searchParams.get("plate")
    if (qPlate && !autoSearched) {
      setPlate(qPlate.toUpperCase())
      setAutoSearched(true)
    }
  }, [searchParams, autoSearched])

  useEffect(() => {
    const qPlate = searchParams.get("plate")
    if (
      qPlate &&
      autoSearched &&
      !vehicle &&
      !loading &&
      plate === qPlate.toUpperCase()
    ) {
      search()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plate, autoSearched])

  const search = async () => {
    const formatted = plate.trim().toUpperCase()
    if (!formatted) {
      setError("Enter a registration number")
      return
    }
    setLoading(true)
    setError("")
    const data = await getVehicle(formatted)
    setTimeout(() => {
      if (!data || Object.keys(data).length === 0) {
        setError("Vehicle not found")
        setVehicle(null)
        setDetails(null)
        setLoading(false)
        return
      }
      setVehicle(data)
      setDetails(buildDetails(data))
      setLoading(false)
    }, 600)
  }

  const samplePlates = [
    "GX15OGJ",
    "HR26DK8337",
    "UP16AB1234",
    "DL8CAF5032",
    "MH02CD5678",
    "KA03EF9012",
    "TN04GH3456",
    "UP05IJ7890",
    "RJ14KL1111",
    "WB20MN2222",
  ]

  const totalPending =
    details?.challans
      ?.filter((c) => !c.paid)
      .reduce((s, c) => s + parseInt(c.amount), 0) || 0

  if (vehicle && details) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Back + Plate */}
          <div
            className="flex items-center gap-4 mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <button
              onClick={() => {
                setVehicle(null)
                setDetails(null)
                setPlate("")
              }}
              className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1"
            >
              ← Back to search
            </button>
          </div>

          {/* Plate Badge */}
          <div
            className="inline-block mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "60ms", animationFillMode: "forwards" }}
          >
            <div className="p-[1px] rounded-2xl bg-gradient-to-r from-teal-400 to-purple-500">
              <div className="px-6 py-3 rounded-2xl bg-[#0f0f16]">
                <span className="text-xl sm:text-2xl font-mono font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                  {vehicle.plate}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Card */}
          <div
            className="p-5 sm:p-6 rounded-3xl bg-[#12121a] border border-white/[0.06] mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-white/[0.10] opacity-0 animate-fade-up"
            style={{ animationDelay: "120ms", animationFillMode: "forwards" }}
          >
            <img
              src={`https://i.pravatar.cc/150?u=${vehicle.plate}`}
              alt="owner"
              className="w-20 h-20 rounded-full object-cover border-2 border-teal-500/30 transition-transform duration-300 hover:scale-105"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {details.firstName} {details.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  Owner
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                    />
                  </svg>
                  {vehicle.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-teal-400 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                {details.phone}
              </div>
            </div>
          </div>

          {/* Details + Documents */}
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Vehicle Details */}
            <div
              className="p-5 sm:p-6 rounded-3xl bg-[#12121a] border border-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-white/[0.10] opacity-0 animate-fade-up"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Vehicle Details
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Model", value: details.model },
                  { label: "Type", value: vehicle.type },
                  { label: "Color", value: details.color },
                  { label: "Chassis No.", value: details.chassis, highlight: true },
                  { label: "Registered on", value: details.regDate },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02] rounded-lg px-2 -mx-2"
                  >
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span
                      className={`text-sm font-semibold ${row.highlight ? "text-teal-400 font-mono" : "text-white"}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div
              className="p-5 sm:p-6 rounded-3xl bg-[#12121a] border border-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-white/[0.10] opacity-0 animate-fade-up"
              style={{ animationDelay: "280ms", animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Documents
                </h3>
              </div>
              <div className="space-y-3">
                {details.documents.map((doc, i) => {
                  const isExpired = doc.expired
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] ${
                        isExpired
                          ? "bg-red-500/5 border-red-500/15"
                          : "bg-emerald-500/5 border-emerald-500/15"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isExpired ? "bg-red-500/10" : "bg-emerald-500/10"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${isExpired ? "text-red-400" : "text-emerald-400"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div
                          className={`text-sm font-semibold ${isExpired ? "text-red-300" : "text-emerald-300"}`}
                        >
                          {doc.name}
                        </div>
                        <div
                          className={`text-xs ${isExpired ? "text-red-400/70" : "text-emerald-400/70"}`}
                        >
                          {doc.status}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Challan History */}
          <div
            className="p-5 sm:p-6 rounded-3xl bg-[#12121a] border border-white/[0.06] mb-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-white/[0.10] opacity-0 animate-fade-up"
            style={{ animationDelay: "360ms", animationFillMode: "forwards" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Challan History
                </h3>
              </div>
              {totalPending > 0 && (
                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                  ₹{totalPending} pending
                </span>
              )}
            </div>
            <div className="space-y-2.5">
              {details.challans.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                    c.paid
                      ? "bg-white/[0.02] border-white/[0.04]"
                      : "bg-amber-500/5 border-amber-500/15"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {c.reason}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {c.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      ₹{c.amount}
                    </div>
                    <div
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.paid
                          ? "bg-teal-500/10 text-teal-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {c.paid ? "Paid" : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Search view
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md opacity-0 animate-scale-in"
        style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
      >
        <div className="p-8 sm:p-10 rounded-3xl bg-[#12121a] border border-white/[0.06] text-center transition-all duration-500 hover:border-white/[0.10] hover:shadow-2xl">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
            <svg
              className="w-7 h-7 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Vehicle Information
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            Enter a registration number to view full owner details, documents,
            challan history, and live location.
          </p>

          {/* Input */}
          <div className="mb-4">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="DL01AB1234"
              className="w-full px-4 py-4 rounded-2xl bg-[#1a1a24] border border-white/[0.08] text-white text-center text-lg font-mono font-semibold tracking-wider placeholder-gray-600 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10 transition-all"
            />
          </div>

          {/* Button */}
          <button
            onClick={search}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-60 mb-8 shadow-lg shadow-purple-500/20 btn-shine"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Search Vehicle <span>→</span>
              </span>
            )}
          </button>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center opacity-0 animate-fade-in"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
              {error}
            </div>
          )}

          {/* Sample plates */}
          <div>
            <p className="text-gray-600 text-xs mb-3">
              Sample numbers to try:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {samplePlates.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPlate(p)
                    setError("")
                  }}
                  className="px-3 py-1.5 rounded-lg bg-transparent border border-white/[0.08] text-teal-400 text-xs font-mono font-semibold hover:border-teal-500/30 hover:bg-teal-500/5 transition-all hover:-translate-y-0.5"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
