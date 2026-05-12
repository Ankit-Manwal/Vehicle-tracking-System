import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
// import Dashboard from "./pages/Dashboard"
import Pricing from "./pages/Pricing"
import Contact from "./pages/Contact"
import GetVehicle from "./pages/GetVehicle"
import Track from "./pages/Track"
import TrackSearch from "./pages/TrackSearch"

function Layout() {
  const location = useLocation()
  const hideNavbar = ["/login", "/signup"].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "" : "pt-14"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
          <Route path="/get" element={<ProtectedRoute><GetVehicle /></ProtectedRoute>} />
          <Route path="/track" element={<ProtectedRoute><TrackSearch /></ProtectedRoute>} />
          <Route path="/track/:plate" element={<ProtectedRoute><Track /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
