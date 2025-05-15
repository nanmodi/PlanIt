import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ai_router from "./routes/ai_assist.js";
import rec_router from "./routes/hotel_recom.js";
import service_router from "./routes/service.js";
import process_router from "./routes/image_location.js";
import run from './db/connect.js'
import cookieParser from 'cookie-parser';
import { authenticate } from "./middlewares/auth.js";
import user_router from "./routes/userlogin.js";
dotenv.config();

const app = express();
run()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://comfy-cheesecake-4706d6.netlify.app',
    'https://timely-cajeta-b04ed1.netlify.app'  
  ],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use("/", user_router);
app.use("/ai",authenticate, ai_router);
app.use("/",authenticate, rec_router);
app.use("/",authenticate,service_router);
app.use("/",authenticate,process_router);

app.get("/", (req, res) => {
  res.send("Happy");
});
const port=process.env.PORT
console.log(port)
app.listen(port, () => console.log(`Server running on port ${port}`));