export default function Home(){

return(

<div className="bg-black text-white pt-20">

{/* HERO */}
<div className="flex items-center justify-between px-12 py-16 h-[90vh] fade-in">

<div className="max-w-xl">

<p className="text-gray-400 mb-2">
AI Surveillance System
</p>

<h1 className="text-5xl font-bold mb-6 leading-tight">
ROUTE TRACK: Smart Vehicle Monitoring
</h1>

<p className="text-gray-400 mb-8">
Track vehicles across city-wide CCTV networks with real-time route visualization and intelligent monitoring.
</p>

<div className="flex gap-4">

<a href="/track">
<button className="bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold">
Start Tracking
</button>
</a>

<a href="#about">
<button className="border border-gray-500 px-6 py-3 rounded-md hover:bg-gray-800">
Learn More
</button>
</a>

</div>

</div>

<div className="w-[50%]">

<img
src="https://images.unsplash.com/photo-1502877338535-766e1452684a"
className="rounded-lg shadow-lg"
/>

</div>

</div>

{/* SECOND SECTION */}
<div id="about" className="bg-white text-black px-12 py-20 flex items-center gap-12 fade-in">

<div className="max-w-xl">

<h2 className="text-4xl font-bold mb-6">
What is Route Track?
</h2>

<p className="text-gray-700 mb-6">
Route Track is an intelligent vehicle tracking system that monitors vehicle movement across multiple camera networks and displays their route on a live map.
</p>

<p className="text-gray-700 mb-8">
It helps in traffic monitoring, security surveillance, and smart city applications by providing real-time insights.
</p>

<button className="border px-6 py-3 rounded-md hover:bg-black hover:text-white">
Explore Tracking
</button>

</div>

<div className="w-[50%]">

<img
src="https://images.unsplash.com/photo-1502920917128-1aa500764ce7"
className="rounded-2xl shadow-lg"
/>

</div>

</div>

</div>

)

}