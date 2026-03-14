import { useParams } from "react-router-dom";

function Details() {
  const { plate } = useParams();

  // Dummy vehicle data
  const vehicleData = {
    model: "Hyundai Creta 2022",
    owner: "Rahul Sharma",
    challans: [
      { date: "12-01-2025", reason: "Overspeeding", fine: "₹1000" },
      { date: "05-11-2024", reason: "Signal Jump", fine: "₹1500" },
    ],
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Vehicle Details</h2>
        <p><strong>License:</strong> {plate}</p>
        <p><strong>Model:</strong> {vehicleData.model}</p>
        <p><strong>Owner:</strong> {vehicleData.owner}</p>

        <h3 style={{ marginTop: "20px" }}>Challan History</h3>
        {vehicleData.challans.map((c, index) => (
          <div key={index} style={styles.challan}>
            <p><strong>Date:</strong> {c.date}</p>
            <p><strong>Reason:</strong> {c.reason}</p>
            <p><strong>Fine:</strong> {c.fine}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "12px",
    width: "450px",
  },
  challan: {
    background: "#334155",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "10px",
  },
};

export default Details;