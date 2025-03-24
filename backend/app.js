import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ai_router from "./routes/ai_assist.js";
import rec_router from "./routes/hotel_recom.js";
import service_router from "./routes/service.js";
import process_router from "./routes/image_location.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/ai", ai_router);
app.use("/", rec_router);
app.use("/", service_router);
app.use("/", process_router);
app.get("/", (req, res) => {
  res.send("Happy");
});
app.listen(3000, () => {
  console.log("App running on port 3000");
});
