import { getJson } from "serpapi";
import dotenv from "dotenv";
dotenv.config();

function fetchHotelDetails(hotelName,startDate,endDate) {
  return new Promise((resolve, reject) => {
    try {
      if (!hotelName) {
        return reject(new Error("Hotel name is required."));
      }

      getJson(
        {
          engine: "google_hotels",
          q: hotelName,
          check_in_date: startDate,
          check_out_date: endDate,
          adults: "2",
          currency: "USD",
          gl: "us",
          hl: "en",
          api_key: process.env.SERP_API,
        },
        (json, error) => {
          if (error) {
            console.error("Error fetching hotel details:", error);
            return reject(new Error("Failed to fetch hotel details."));
          }

          if (!json) {
            console.error("No data received from API.");
            return reject(new Error("No data available."));
          }

          const data = {
            "hotel-name": hotelName,
            "location-rating": json.location_rating || "N/A",
            "overall-rating": json.overall_rating || "N/A",
            "hotel-class": json.hotel_class || "N/A",
            "address": json.address || "N/A",
            "check-in-time": json.check_in_time || "N/A",
            "check-out-time": json.check_out_time || "N/A",
            "description": json.description || "N/A",
            "phone": json.phone_link || "N/A",
            "website": json.link || "N/A",
            "lprice": json.typical_price_range?.extracted_lowest || "N/A",
            "hprice": json.typical_price_range?.extracted_highest || "N/A",
            "near-by": json.nearby_places?.map((item) => ({
              "name": item.name || "N/A",
              "link": item.link || "N/A",
              "rating": item.rating || "N/A",
              "description": item.description || "N/A",
              "transportation": item.transportations?.map((item1) => ({
                "type": item1.type || "N/A",
                "duration": item1.duration || "N/A",
              })) || [],
            })) || [],
            "image": json.images && json.images.length > 0 ? json.images[0].thumbnail : "N/A"


          };

          resolve(data);
        }
      );
    } catch (err) {
      console.error("Unexpected error:", err.message);
      reject(new Error("Unexpected error occurred."));
    }
  });
}


export default fetchHotelDetails;
