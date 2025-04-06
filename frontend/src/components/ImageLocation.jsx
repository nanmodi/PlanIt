import { useState } from "react";

export default function ImprovedImageUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    // Create preview for selected image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setMessage([]);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Add this to send cookies
      });

      const data = await response.json();
      console.log(data);
      setMessage(Array.isArray(data.message) ? data.message : JSON.parse(data.message));

    } catch (error) {
      console.error("Error uploading file:", error.message);
      setMessage([{ error: "Failed to upload file" }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
             Discover your destination
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Upload an image to discover similar travel destinations
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Upload section */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload an Image</h2>
            
            <div className="space-y-4">
              {/* File input with preview */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose an image of a landmark
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {preview && (
                  <div className="w-32 h-32 sm:w-48 sm:h-48 border rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Upload button */}
              <div>
                <button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${loading || !file 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Identify Landmark"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Results section */}
          {message.length > 0 && (
            <div className="p-6 sm:p-8 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {message.length > 1 ? "Landmarks Found" : "Landmark Found"}
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {message.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    {item.error ? (
                      <div className="text-red-500 p-4 text-center">{item.error}</div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-lg text-gray-900 mb-2">{item.name || "Unknown Landmark"}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex">
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span className="text-gray-700">{item.location || "Location unknown"}</span>
                          </div>
                          
                          <div className="flex">
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                            </svg>
                            <span className="text-gray-700">{item.weather || "Weather information unavailable"}</span>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-gray-600 line-clamp-3">{item.description || "No description available"}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}