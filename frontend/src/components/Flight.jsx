import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const Flight = () => {
  const [flights, setFlights] = useState([]);
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [outd, setOutd] = useState("");
  const [retd, setRetd] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/flight_details", {
        departure,
        arrival,
        outd,
        retd,
      });
      
      setFlights(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Search Flights</h2>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Departure City"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Arrival City"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <input
            type="date"
            value={outd}
            onChange={(e) => setOutd(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <input
            type="date"
            value={retd}
            onChange={(e) => setRetd(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <button 
          onClick={fetchFlights}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : flights.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">Airline</th>
                <th className="px-4 py-2 border text-left">Flight Number</th>
                <th className="px-4 py-2 border text-left">Departure Airport</th>
                <th className="px-4 py-2 border text-left">Departure Time</th>
                <th className="px-4 py-2 border text-left">Arrival Airport</th>
                <th className="px-4 py-2 border text-left">Arrival Time</th>
               
                <th className="px-4 py-2 border text-left">Duration</th>
                <th className="px-4 py-2 border text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 border">{flight.airline}</td>
                  <td className="px-4 py-3 border">{flight.flight_number}</td>
                  <td className="px-4 py-3 border">{flight.departure.name}</td>
                  <td className="px-4 py-3 border">{flight.departure.time}</td>
                  <td className="px-4 py-3 border">{flight.arrival.name}</td>
                  <td className="px-4 py-3 border">{flight.arrival.time}</td>
                 
                  <td className="px-4 py-3 border">{flight.duration}</td>
                  <td className="px-4 py-3 border text-right">${flight.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-600">No flights found.</p>
      )}
    </div>
    </>
  );
};

export default Flight;