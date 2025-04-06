import { Router} from "express";
import dotenv from "dotenv";
import axios from "axios";
import fetchHotelDetails from '../hotel_recommendation.js'
dotenv.config();
const PYTHON_API_URL = "http://127.0.0.1:5000";
const rec_router=Router();



rec_router.post("/hotels/recommend", async (req, res) => {
  const { state, city, min_price, max_price, landmark, startDate, endDate } = req.body;
  console.log("Request Body:", req.body);
  if (!state || !city || !min_price || !max_price) {
    return res.status(400).json({ error: "Missing required fields: state, city, min_price, max_price" });
  }

  try {
    console.log(`Fetching recommendations for ${city}, ${state}...`);
    const response = await axios.get(`${PYTHON_API_URL}/recommend/hotels`, {
      params: { state, city, min_price, max_price, landmark },
    });

    if (!response.data) {
      return res.status(404).json({ error: "No hotel recommendations found" });
    }

    const hotelNames = response.data.map(hotel => hotel.property_name);
    console.log("Hotel Names Fetched:", hotelNames);

    const hotelDetails = await Promise.all(hotelNames.map(async (hotelName) => {
      try {
        const details = await fetchHotelDetails(hotelName, startDate, endDate);
        console.log(details.image)
        return {
          hotelName,
          locationRating: details?.["location-rating"] || "N/A",
          overallRating: details?.["overall-rating"] || "N/A",
          hotelClass: details?.["hotel-class"] || "N/A",
          address: details?.address || "N/A",
          checkInTime: details?.["check-in-time"] || "N/A",
          checkOutTime: details?.["check-out-time"] || "N/A",
          description: details?.description || "N/A",
          phone: details?.phone || "N/A",
          website: details?.website || "N/A",
          priceRange: details?.lprice && details?.hprice ? `$${details.lprice} - $${details.hprice}` : "N/A",
          nearBy: details?.["near-by"]?.map(item => ({
            name: item?.name || "N/A",
            link: item.link || "N/A",
            rating: item.rating || "N/A",
            description: item.description || "N/A",
          })) || [],
          image: details.image||"N/A"
        };
      } catch (fetchError) {
        console.error(`Error fetching details for ${hotelName}:`, fetchError.message);
        return {
          hotelName,
          error: "Details not available",
          locationRating: "N/A",
          overallRating: "N/A",
          hotelClass: "N/A",
          address: "N/A",
          description: "Error fetching details",
          nearBy: [],
        };
      }
    }));

    res.json(hotelDetails);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


rec_router.get('/hotels/by-price', async (req, res) => {
  const { price, count } = req.query;
  try {
      const response = await axios.get(`${PYTHON_API_URL}/recommend/by-price`, { params: { price, count } });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: "Error fetching recommendations" });
  }
});

rec_router.get('/hotels/by-rating', async (req, res) => {
  const { rating, count } = req.query;
  try {
      const response = await axios.get(`${PYTHON_API_URL}/recommend/by-rating`, { params: { rating, count } });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: "Error fetching recommendations" });
  }
});
export default rec_router;