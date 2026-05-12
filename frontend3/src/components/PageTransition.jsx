import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

export default function PageTransition({ children }) {
  const location = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove("page-enter")
    void el.offsetWidth
    el.classList.add("page-enter")
  }, [location.pathname])

  return (
    <div ref={ref} className="page-enter min-h-screen">
      {children}
    </div>
  )
}
