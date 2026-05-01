import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import GetVehicle from "./pages/GetVehicle"
import Track from "./pages/Track"
import TrackSearch from "./pages/TrackSearch"

function App(){

return(

<BrowserRouter>

<Navbar/>

{/* Fixed navbar spacing */}
<div className="pt-16">
<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/get" element={<GetVehicle/>}/>
<Route path="/track" element={<TrackSearch/>}/>
<Route path="/track/:plate" element={<Track/>}/>

</Routes>
</div>

</BrowserRouter>

)

}

export default App