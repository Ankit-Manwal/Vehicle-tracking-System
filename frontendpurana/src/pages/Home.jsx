import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [plate, setPlate] = useState("GX15OGJ");
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Smart Vehicle Tracking</h1>
        <p className="hero-subtitle">
          Track vehicles in real-time or access detailed information
        </p>

        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Enter License Number"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />

          <div className="button-group">
            <button
              className="btn-primary"
              onClick={() => navigate(`/track/${plate}`)}
            >
              Track Vehicle
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate(`/details/${plate}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;