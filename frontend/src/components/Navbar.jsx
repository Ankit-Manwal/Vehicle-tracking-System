import { useState } from "react"
import { NavLink } from "react-router-dom"

export default function Navbar(){
const [open, setOpen] = useState(false)

const linkClass = ({ isActive }) =>
  `hover:text-white transition-colors ${isActive ? "text-white" : "text-gray-400"}`

return(

<nav className="fixed top-0 w-full z-50 h-16 bg-gray-950/95 backdrop-blur border-b border-gray-800">

<div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center">

<NavLink to="/" className="text-lg font-semibold tracking-wide hover:text-white">
  ROUTE TRACK
</NavLink>

{/* Desktop nav */}
<div className="hidden md:flex gap-8 text-sm">

<NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
<NavLink to="/get" className={linkClass} onClick={() => setOpen(false)}>Get Vehicle Detail</NavLink>
<NavLink to="/track" className={linkClass} onClick={() => setOpen(false)}>Track</NavLink>

</div>

{/* Desktop actions */}
<div className="hidden md:flex items-center gap-3">
  <NavLink
    to="/contact"
    className="text-sm text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 px-4 py-2 rounded-lg transition-colors"
    onClick={() => setOpen(false)}
  >
    Contact
  </NavLink>
  <NavLink
    to="/login"
    className="text-sm text-black bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-lg font-semibold transition-colors"
    onClick={() => setOpen(false)}
  >
    Login
  </NavLink>
</div>

{/* Mobile menu button */}
<button
  className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-800 text-gray-200 hover:bg-gray-900"
  onClick={() => setOpen((v) => !v)}
  aria-label="Toggle menu"
  aria-expanded={open}
>
  <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
</button>

</div>

{/* Mobile nav */}
{open ? (
  <div className="md:hidden border-t border-gray-800 bg-gray-950">
    <div className="max-w-7xl mx-auto px-8 py-3 flex flex-col gap-3 text-sm">
      <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/get" className={linkClass} onClick={() => setOpen(false)}>Get Vehicle Detail</NavLink>
      <NavLink to="/track" className={linkClass} onClick={() => setOpen(false)}>Track</NavLink>
      <div className="h-px bg-gray-800 my-2" />
      <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
      <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Login</NavLink>
    </div>
  </div>
) : null}

</nav>

)

}