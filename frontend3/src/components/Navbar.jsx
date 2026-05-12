import { useState, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsAuth(localStorage.getItem("route_auth") === "true")
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("route_auth")
    setIsAuth(false)
    navigate("/login")
  }

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/get", label: "Vehicle Info" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ]
  // const authLinks = isAuth ? [
  //   { to: "/dashboard", label: "Dashboard" },
  //   { to: "/track", label: "Track" },
  // ] : []
  const authLinks = isAuth ? [{ to: "/track", label: "Track" }] : []

  const allLinks = [...publicLinks, ...authLinks]

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1e1e2e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold">
            <span className="text-purple-400">Route</span><span className="text-white">Track</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {allLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "text-purple-300" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {isAuth ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg text-sm font-medium border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all"
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-purple-400 hover:bg-purple-300 text-black transition-all active:scale-95"
              >
                Get started
              </NavLink>
              <NavLink
                to="/track"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Track
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#1e1e2e] px-4 py-3 space-y-1">
          {allLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-purple-300 bg-purple-500/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-white/5 pt-2 mt-2 flex gap-2">
            {isAuth ? (
              <button onClick={() => { setOpen(false); handleLogout() }} className="flex-1 text-center px-3 py-2 rounded-lg text-sm text-red-400 border border-red-500/20">Logout</button>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2 rounded-lg text-sm text-gray-300 border border-white/10">Sign in</NavLink>
                <NavLink to="/signup" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2 rounded-lg text-sm bg-purple-400 text-black">Get started</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
