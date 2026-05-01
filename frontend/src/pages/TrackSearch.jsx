import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NumberPlateManager from "../components/NumberPlateManager"

export default function TrackSearch(){
const API_BASE_URL = "http://localhost:5000"
const [selectedPlate,setSelectedPlate] = useState("")
const [platesToDetect,setPlatesToDetect] = useState([])

const navigate = useNavigate()

const fetchPlates = async () => {
try{
const res = await fetch(`${API_BASE_URL}/plates-to-detect`)
if(!res.ok) return
const data = await res.json()
const list = Array.isArray(data?.number_pate_to_detect) ? data.number_pate_to_detect : []
setPlatesToDetect(list)
if(!selectedPlate && list.length){
setSelectedPlate(list[0])
}
}catch(err){
console.error("Failed to fetch plates", err)
}
}

useEffect(()=>{
fetchPlates()
},[])

const handleAddPlate = async (formatted) => {
try{
const res = await fetch(`${API_BASE_URL}/plates-to-detect`,{
method: "POST",
headers: {"Content-Type":"application/json"},
body: JSON.stringify({plate: formatted}),
})
if(!res.ok) return
const data = await res.json()
const list = Array.isArray(data?.number_pate_to_detect) ? data.number_pate_to_detect : []
setPlatesToDetect(list)
setSelectedPlate(formatted)
}catch(err){
console.error("Failed to add plate", err)
}
}

const handleDeletePlate = async (plateToDelete) => {
try{
const res = await fetch(`${API_BASE_URL}/plates-to-detect/${encodeURIComponent(plateToDelete)}`,{
method: "DELETE",
})
if(!res.ok) return
const data = await res.json()
const list = Array.isArray(data?.number_pate_to_detect) ? data.number_pate_to_detect : []
setPlatesToDetect(list)
if(selectedPlate === plateToDelete){
setSelectedPlate(list[0] || "")
}
}catch(err){
console.error("Failed to delete plate", err)
}
}

const handleTrack = () => {
const plateToTrack = selectedPlate || (platesToDetect[0] || "")

if(!plateToTrack){
alert("Add at least one vehicle number before tracking")
return
}

navigate(`/track/${plateToTrack}`)

}

return(

<div className="max-w-3xl mx-auto mt-10 p-6 rounded-xl bg-slate-900 text-white">

<h2 className="text-3xl font-bold mb-4">
Track Vehicles
</h2>

<p className="text-slate-300 mb-4">
Add one or more number plates, then click Track Vehicle to start analysis.
</p>

<NumberPlateManager
title="Add Number Plates For Detection AP05JEO GX15OGJ"
plates={platesToDetect}
selectedPlate={selectedPlate}
onSelectPlate={setSelectedPlate}
onAddPlate={handleAddPlate}
onDeletePlate={handleDeletePlate}
addButtonLabel="Add"
/>

<button
onClick={handleTrack}
className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
>
Track Vehicle
</button>

</div>

)
}