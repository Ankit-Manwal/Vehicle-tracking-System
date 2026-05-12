import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getVehicle} from "../services/api"
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup
} from "react-leaflet"

export default function Track(){

  const { plate } = useParams()
  const [vehicle,setVehicle] = useState(null)
  const [video,setVideo] = useState("")
  const [markers,setMarkers] = useState([])

  useEffect(()=>{
    async function load(){
      const data = await getVehicle(plate)
      if(data){
        setVehicle(data)
      }
    }
    load()
  },[plate])

  const clickCamera = (cam)=>{
    setVideo(cam.video)

    if(!markers.find(m=>m.name === cam.name)){
      setMarkers(prev => [...prev, cam])
    }
  }

  const routePositions = markers.map(m=>[m.lat,m.lng])

  if(!vehicle){
    return <h2 className="text-white p-10">Loading...</h2>
  }

  return(

    // 🔥 FIX: added pt-20 (navbar spacing)
    <div className="flex h-screen pt-20 bg-black text-white">

      {/* LEFT */}
      <div className="w-1/2 p-6 flex flex-col gap-6 overflow-y-auto">

        <h2 className="text-xl font-semibold">Camera Network</h2>

        <div className="grid grid-cols-2 gap-4">

          {vehicle.cameras.map((cam,i)=>(
            <button
              key={i}
              onClick={()=>clickCamera(cam)}
              className={`p-4 rounded-xl border ${
                markers.find(m=>m.name===cam.name)
                  ? "bg-blue-600"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {cam.name}
            </button>
          ))}

        </div>

        {/* VIDEO */}
        <div className="bg-gray-900 rounded-xl border border-gray-700">

          <div className="flex justify-between p-3 border-b border-gray-700">
            <span>{video ? "Camera Feed" : "Select Camera"}</span>
            <span className="text-red-500">● LIVE</span>
          </div>

          {video && (
            <video className="w-full" controls autoPlay>
              <source src={video}/>
            </video>
          )}

        </div>

        {/* VEHICLE */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">

          <h3 className="text-lg mb-3">Vehicle Details</h3>

          <p>Plate: {vehicle.plate}</p>
          <p>Owner: {vehicle.owner}</p>
          <p>Type: {vehicle.type}</p>

          <img
            src={vehicle.image || "https://i.pravatar.cc/100"}
            className="mt-3 w-16 h-16 rounded-full"
          />

        </div>

      </div>

      {/* MAP */}
      <div className="w-1/2 h-full">

        <MapContainer
          center={[28.6139,77.2090]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map((m,i)=>(
            <Marker key={i} position={[m.lat,m.lng]}>
              <Popup>{m.name}</Popup>
            </Marker>
          ))}

          {routePositions.length > 1 && (
            <Polyline positions={routePositions} color="red"/>
          )}

        </MapContainer>

      </div>

    </div>

  )
}