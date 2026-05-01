import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tracking from "./pages/Tracking";
import Details from "./pages/Details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track/:plate" element={<Tracking />} />
        <Route path="/details/:plate" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;