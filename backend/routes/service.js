import { Router} from "express";
import dotenv from "dotenv";
import { getFlight } from "../flight.js";
import { getEvents } from "../services/getEvents.js";
import { getHotels } from "../services/getHotels.js";
dotenv.config();
const service_router=Router();
service_router.post('/flight_details', async (req, res) => {
  try {
    const { departure, arrival, outd, retd } = req.body;
    const response=await getFlight(departure, arrival, outd, retd);
    console.log(response);
    res.json(response);
  } catch (error) {
    console.log(error)
  }
})
service_router.post('/events_detail', async (req, res) => {
  try {
    const { location } = req.body;
    const response=await getEvents(location);
    console.log(response)
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})
service_router.get("/hotels_detail",async(req,res)=>{
  try {
    const { city, check_in, check_out, adults, currency } = req.query;
   console.log(city, check_in, check_out, adults, currency);
    if (!city || !check_in || !check_out) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const hotels = await getHotels(
      city,
      check_in,
      check_out,
      adults || 1,
      currency || "USD"
    );

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }

})
































export default service_router;