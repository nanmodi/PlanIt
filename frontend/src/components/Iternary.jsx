import React, { useState } from 'react'
import axios from 'axios'

const Iternary = () => {
  const [location, setLocation] = useState('')
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [interests, setInterests] = useState([])
  const [iternary, setIternary] = useState(null) // Changed from '' to null

  async function fetchResponse(e) {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate/iternary', {
        location,
        start_date,
        end_date,
        budget,
        interests,
      })
      console.log(response.data)
      setIternary(response.data.iternary) // Set to the 'iternary' array from response
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Travel Itinerary Generator</h1>

        <form onSubmit={fetchResponse} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Mumbai"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Start Date:</label>
            <input
              type="date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">End Date:</label>
            <input
              type="date"
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Budget:</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 2000"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Interests (comma separated):</label>
            <input
              type="text"
              value={interests.join(',')}
              onChange={(e) => setInterests(e.target.value.split(','))}
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. music, food, culture"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Generate Itinerary
          </button>
        </form>

        {iternary && iternary.map((dayString, index) => { // Added check for iternary
          const lines = dayString.trim().split('\n').filter(Boolean); // remove empty lines

          const day = lines[0]; // e.g., Day 1 - 2025-04-17
          const stay = lines[1]?.replace("Stay at:", "").trim(); // hotel info
          const event = lines[2]?.replace("Event:", "").trim(); // event name
          const date = lines[3]?.replace("Date:", "").trim(); // raw date info
          const location = lines[4]?.replace("Location:", "").trim(); // location info

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 my-4 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{day}</h3>
              <div className="space-y-2 text-gray-800">
                <div>
                  <span className="font-semibold">🏨 Stay at:</span> {stay}
                </div>
                <div>
                  <span className="font-semibold">🎉 Event:</span> {event}
                </div>
                <div>
                  <span className="font-semibold">📅 Date:</span>{' '}
                  <pre className="inline whitespace-pre-wrap break-words text-sm text-gray-600">{date}</pre>
                </div>
                <div>
                  <span className="font-semibold">📍 Location:</span>{' '}
                  <pre className="inline whitespace-pre-wrap break-words text-sm text-gray-600">{location}</pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Iternary