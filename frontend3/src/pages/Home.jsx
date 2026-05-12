import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

function ChoiceModal({ plate, onClose }) {
  const navigate = useNavigate()
  if (!plate) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#1a1a24] border border-white/[0.08] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-1">Choose an action</h3>
          <p className="text-gray-500 text-sm">What would you like to do with <span className="text-purple-300 font-mono font-semibold">{plate}</span>?</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/get?plate=${encodeURIComponent(plate)}`)}
            className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-purple-500/30 transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Get Vehicle Info</div>
              <div className="text-xs text-gray-500">Owner, model, registration</div>
            </div>
            <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <button
            onClick={() => navigate(`/track/${encodeURIComponent(plate)}`)}
            className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-teal-500/30 transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Track Vehicle</div>
              <div className="text-xs text-gray-500">Real-time Vehicle Tracking</div>
            </div>
            <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchPlate, setSearchPlate] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(localStorage.getItem("route_auth") === "true")
  }, [location])

  const handleSearch = () => {
    if (searchPlate.trim()) setShowModal(true)
  }

  return (
    <div className="bg-[#1e1e2e] text-white min-h-screen overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-20 pb-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/40 bg-purple-500/10 text-sm text-purple-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Real-time Vehicle Tracking Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 max-w-2xl">
            Know everything about{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              any vehicle
            </span>{" "}
            instantly.
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed">
            Track any vehicle in real time and get complete vehicle information instantly.
            India's smartest vehicle tracking platform.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mb-4">
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <svg className="w-5 h-5 text-gray-500 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="TN04GH3456"
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base py-2"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-purple-400 hover:bg-purple-300 text-black font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-2"
              >
                Search Vehicle <span>→</span>
              </button>
            </div>
          </div>

          {/* Try samples */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 text-sm">Try →</span>
            {["GX15OGJ", "HR26DK8337", "UP16AB1234", "DL8CAF5032"].map((plate) => (
              <button
                key={plate}
                onClick={() => { setSearchPlate(plate); handleSearch() }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 hover:bg-white/10 hover:border-purple-500/30 transition-all"
              >
                {plate}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR =====
      <section className="relative py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { value: "50K+", label: "Vehicles tracked" },
              { value: "<1s", label: "Response time" },
              { value: "99.9%", label: "Uptime" },
              { value: "180+", label: "Cities covered" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-bold text-teal-300 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-xs font-bold tracking-wider text-purple-300 uppercase mb-4">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Track & identify<br />any vehicle
            </h2>
            <p className="text-gray-400 mt-3 max-w-md">
              Search any vehicle number to track its live location or get complete details instantly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", title: "Live  Tracking", desc: "Real-time location updates with live camera streams and route visualization." },
              { icon: "M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z", title: "Vehicle Information", desc: "Instant access to vehicle registration details, owner info, and model data." },
              { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", title: "Multi-Camera Streams", desc: "Multiple live camera feeds for wider area coverage and faster detection." },
              { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", title: "Route History", desc: "Visualize complete travel routes with timestamps and detection points on the map." },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-purple-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Get results in <span className="text-teal-300">3 steps</span></h2>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-purple-500/50 via-teal-500/50 to-purple-500/50" />

            {[
              { step: "01", title: "Enter plate number", desc: "Type any vehicle registration number in the search bar." },
              { step: "02", title: "View vehicle details", desc: "Get full vehicle info including registration, model, and owner details." },
              { step: "03", title: "Track on map", desc: "Click Track to track the vehicle in real-time and live camera streams." },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-teal-300/80 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS =====
      <section className="relative py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-xs font-bold tracking-wider text-purple-300 uppercase mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Loved by thousands</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { text: "I can now track my entire fleet from a single dashboard. Truly a game changer.", name: "Arjun Mehta", role: "Fleet Manager" },
              { text: "Getting vehicle details instantly has made our daily operations so much smoother.", name: "Priya Singh", role: "Logistics Head" },
              { text: "Real-time tracking and vehicle info in one place. Couldn’t ask for more.", name: "Rahul Verma", role: "Car Owner" },
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.28.588 1.81l-2.8 1.934a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-1.934a1 1 0 00-1.175 0l-2.8 1.934c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.53-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {!isAuth && (
        <section className="relative py-20 px-4 sm:px-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Start tracking for free</h2>
            <p className="text-gray-400 mb-8">Create your account in 30 seconds. No credit card required.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="px-8 py-3 bg-purple-400 hover:bg-purple-300 text-black font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                Create free account →
              </Link>
              <Link
                to="/get"
                className="px-8 py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all hover:bg-white/5"
              >
                Try without signing up →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="text-xl font-bold mb-3">
              <span className="text-purple-400">Route</span><span className="text-white">Track</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              India's smartest vehicle tracking platform.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link to="/get" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Vehicle Info</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Pricing</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Sign in</Link></li>
              <li><Link to="/signup" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Register</Link></li>
              {/* <li><Link to="/dashboard" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Dashboard</Link></li> */}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-gray-500 cursor-pointer hover:text-purple-400 transition-colors">Privacy Policy</span></li>
              <li><span className="text-sm text-gray-500 cursor-pointer hover:text-purple-400 transition-colors">Terms of Use</span></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} RouteTrack. All rights reserved.
        </div>
      </footer>

      {showModal && <ChoiceModal plate={searchPlate} onClose={() => setShowModal(false)} />}
    </div>
  )
}
