import React, { useState } from "react";
import Navbar from "./Navbar";
const Events = () => {
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/events_detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch events");
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Events by Location</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button 
          onClick={fetchEvents} 
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <li key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
              <div className="bg-blue-100 px-4 py-3 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
              </div>
              <div><img src={event.image} alt={event.title} 
  className="w-full h-48 object-cover rounded"></img></div>
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {event.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Start Date:</span> {event.start_date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {event.address}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Venue:</span> {event.venue} 
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Rating: {event.venue_rating}
                  </span>
                </p>
                
                <div className="flex flex-wrap gap-2 pt-3">
                  <a 
                    href={event.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View Event
                  </a>
                  <a 
                    href={event.venue_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-purple-600 text-purple-600 text-sm font-medium rounded-md hover:bg-purple-50 transition-colors"
                  >
                    Venue Details
                  </a>
                  <a 
                    href={event.event_location} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 transition-colors"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 border rounded-md bg-white">
          <p className="text-gray-600">No events found. Try searching for a different location.</p>
        </div>
      )}
    </div></>
  );
};

export default Events;