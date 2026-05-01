import { useState } from "react"
import { getVehicle } from "../services/api"
import { useNavigate } from "react-router-dom"

export default function GetVehicle(){

const [plate,setPlate] = useState("")
const [vehicle,setVehicle] = useState(null)
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

const navigate = useNavigate()

const search = async () => {

const formatted = plate.trim().toUpperCase()

if(!formatted){
setError("Enter vehicle number")
return
}

setLoading(true)

const data = await getVehicle(formatted)

setTimeout(()=>{

if(!data || Object.keys(data).length===0){
setError("Vehicle not found")
setVehicle(null)
setLoading(false)
return
}

setVehicle(data)
setError("")
setLoading(false)

},600) // small animation delay

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

{/* MAIN CARD */}
<div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl transition-all duration-300">

{/* TITLE */}
<h1 className="text-4xl font-bold text-center mb-10 tracking-wide">
Get Vehicle Detail
</h1>

{/* INPUT */}
<div className="flex gap-4 mb-6">

<input
value={plate}
onChange={(e)=>setPlate(e.target.value)}
placeholder="Enter Vehicle Number"
className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
/>

<button
onClick={search}
className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all font-semibold shadow-lg"
>
{loading ? "Searching..." : "Search"}
</button>

</div>

{/* ERROR */}
{error && (
<p className="text-red-400 text-center mb-4 animate-pulse">
{error}
</p>
)}

{/* LOADING */}
{loading && (
<div className="flex justify-center mt-6">
<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
</div>
)}

{/* RESULT */}
{vehicle && !loading && (

<div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 flex gap-6 items-center animate-fadeIn">

{/* OWNER IMAGE */}
<img
src={vehicle.image || "https://i.pravatar.cc/150?img=12"}
alt="owner"
className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
/>

{/* DETAILS */}
<div className="flex-1">

<h2 className="text-xl font-semibold mb-2">
{vehicle.owner}
</h2>

<p className="text-gray-400 text-sm mb-1">
Plate: {vehicle.plate}
</p>

<p className="text-gray-400 text-sm mb-3">
Type: {vehicle.type}
</p>

<button
onClick={()=>navigate(`/track/${vehicle.plate}`)}
className="mt-2 bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
>
Track Vehicle
</button>

</div>

</div>

)}

</div>

</div>

)

}