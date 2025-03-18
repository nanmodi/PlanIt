export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="w-full bg-blue-900 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">PlanIt</h1>
        <button className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 hover:text-black">Login</button>
      </nav>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-400">Welcome to PlanIt</h1>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl">
          Plan your trips effortlessly with personalized recommendations, AI
          assistance, and a seamless itinerary generator.
        </p>
        <div className="space-y-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
            Start Planning
          </button>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all">
            View Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
