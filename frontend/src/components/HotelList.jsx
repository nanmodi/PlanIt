import React, { useState } from 'react';
import axios from 'axios';

function HotelList() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [landmark, setLandmark] = useState('');
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/hotels/recommend/', {
        state,
        city,
        min_price: Number(minRating) || 0,
        max_price: Number(maxRating) || 0,
        landmark,
        startDate,
        endDate,
      },{withCredentials:true});

      console.log(response.data);

      
      setRecommendedHotels(Array.isArray(response.data) ? response.data : []);
      
      
      if ((Array.isArray(response.data) ? response.data : []).length > 0) {
        setActiveTab('results');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch hotel recommendations');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with animated gradient */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg opacity-10 transform -skew-y-1"></div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Search your stay
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover perfect accommodations tailored to your preferences
          </p>
        </div>

        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg transition-all duration-200 focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              disabled={recommendedHotels.length === 0}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg transition-all duration-200 focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                activeTab === 'results'
                  ? 'bg-blue-600 text-white'
                  : recommendedHotels.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              Results {recommendedHotels.length > 0 && `(${recommendedHotels.length})`}
            </button>
          </div>
        </div>

        {/* Search Panel */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  placeholder="City (e.g., New Delhi)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">State/Region</label>
                <input
                  type="text"
                  placeholder="State (e.g., Delhi)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Nearby Landmark</label>
                <input
                  type="text"
                  placeholder="Landmark (e.g., India Gate)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Min (1-5)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Maximum Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Max (1-5)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={loading || (!city && !state)}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${loading || (!city && !state) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-1'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    'Find Perfect Hotels'
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center my-12 py-16">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin absolute top-2 left-2"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Finding your perfect stays...</p>
            <p className="text-sm text-gray-500">This might take a moment</p>
          </div>
        )}

        {/* Results Panel */}
        {activeTab === 'results' && !loading && (
          <>
            {recommendedHotels.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Found {recommendedHotels.length} Hotels
                  </h2>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Modify Search
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedHotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    >
                      {hotel.image ? (
                        <img src={hotel.image} alt={hotel.hotelName} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{hotel.hotelName || 'Unnamed Hotel'}</h3>
                          {hotel.overallRating !== 'N/A' && (
                            <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {hotel.overallRating}
                            </span>
                          )}
                        </div>
                        
                        {hotel.address !== 'N/A' && (
                          <div className="flex items-start mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-gray-600 text-sm line-clamp-2">{hotel.address}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 space-y-3">
                          {hotel.priceRange !== '$N/A - $N/A' && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-gray-700 font-medium">{hotel.priceRange}</p>
                            </div>
                          )}
                          
                          {(hotel.checkInTime !== 'N/A' || hotel.checkOutTime !== 'N/A') && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-gray-700">
                                {hotel.checkInTime !== 'N/A' ? hotel.checkInTime : 'Check-in N/A'} / {hotel.checkOutTime !== 'N/A' ? hotel.checkOutTime : 'Check-out N/A'}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {hotel.description !== 'N/A' && (
                          <div className="mt-4">
                            <p className="text-gray-600 text-sm line-clamp-3">{hotel.description}</p>
                          </div>
                        )}
                        
                        {hotel.nearBy?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Nearby Places:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {hotel.nearBy.slice(0, 2).map((place, idx) => (
                                <li key={idx} className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {place.name} {place.distance && <span className="text-gray-500">({place.distance})</span>}
                                </li>
                              ))}
                              {hotel.nearBy.length > 2 && (
                                <li className="text-blue-600 text-sm cursor-pointer hover:text-blue-800 transition-colors">
                                  + {hotel.nearBy.length - 2} more places
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        <div className="mt-6 flex items-center justify-between">
                          {hotel.phone !== "N/A" && (
                            <a
                              href={`tel:${hotel.phone}`}
                              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call
                            </a>
                          )}
                          
                          {hotel.website !== "N/A" && (
                            <a
                              href={hotel.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                            >
                              Visit Website
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Hotels Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any hotels matching your criteria. Try adjusting your search parameters.
                </p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-16 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Hotel Finder. All rights reserved.</p>
      </div>
    </div>
  );
}

export default HotelList;