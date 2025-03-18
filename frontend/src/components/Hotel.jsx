import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Hotel = () => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    if (!city) {
      setError("City is required!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:3000/hotels_detail", {
        params: { city, check_in: checkIn, check_out: checkOut, adults },
      });
      setHotels(response.data);
    } catch (err) {
      setError("Failed to fetch hotels. Try again later.");
    }

    setLoading(false);
  };

  return (
    <>
     <Navbar />
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
     
      <h1 className="text-3xl font-bold mb-6">Hotel Search</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-gray-700">City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-gray-700">Check-in:</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-gray-700">Check-out:</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-gray-700">Adults:</label>
        <input
          type="number"
          min="1"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={fetchHotels}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Searching..." : "Find Hotels"}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      <div className="mt-6 w-full max-w-2xl">
        {hotels.length > 0 && <h2 className="text-xl font-semibold mb-4">Available Hotels</h2>}
        {hotels.map((hotel, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow mb-3">
            <img src={hotel.image} alt={hotel.name} 
  className="w-full h-48 object-cover rounded"></img>
            <h3 className="text-lg font-bold">{hotel.name}</h3>
            <p className="text-gray-600">Type: {hotel.type}</p>
            <p className="text-gray-600">Rating: {hotel.rating}</p>
            <p className="text-gray-600">Price: {hotel.price || "N/A"}</p>
            <p className="text-gray-600">Check-in: {hotel.check_in_time || "N/A"}</p>
            <p className="text-gray-600">Check-out: {hotel.check_out_time || "N/A"}</p>
            <p className="text-gray-600">Reviews: {hotel.reviews || "No reviews"}</p>
            {hotel.link && (
              <a
                href={hotel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Details
              </a>
            )}
          </div>
        ))}
      </div>
    </div></>
  );
};

export default Hotel;
