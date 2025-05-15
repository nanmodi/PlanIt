import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import ai_router from "./routes/ai_assist.js";
import rec_router from "./routes/hotel_recom.js";
import service_router from "./routes/service.js";
import process_router from "./routes/image_location.js";
import user_router from "./routes/userlogin.js";

import run from './db/connect.js';

dotenv.config();

const app = express();
run();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://comfy-cheesecake-4706d6.netlify.app',
  'https://timely-cajeta-b04ed1.netlify.app'
];


app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routers
app.use("/", user_router);
app.use("/ai", ai_router);
app.use("/", rec_router);
app.use("/", service_router);
app.use("/", process_router);

app.get("/", (req, res) => {
  res.send("Happy");
});

// Port binding
const port = process.env.PORT || 3000;
console.log(`Port: ${port}`);
app.listen(port, () => console.log(`Server running on port ${port}`));

