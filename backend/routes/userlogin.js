import { Router} from "express";
import dotenv from "dotenv";
import {User} from "../db/userdb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
dotenv.config();
const user_router=Router();

user_router.post("/register",async (req,res)=>{
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // or "Lax"
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.cookie("name", newUser.name, {
     
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // or "Lax"
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    res.status(201).json({ message: "User registered successfully",  name: newUser.name, email: newUser.email, token });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
user_router.post("/login",async (req,res)=>{
  try{
    const { email, password } = req.body;
    console.log('login')
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // or "Lax"
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.cookie("name", user.name, {
      
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // or "Lax"
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    console.log(req.cookies)
    res.status(200).json({ message: "Login successful", name: user.name, email: user.email, token });

  } catch(error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
user_router.get("/logout",async (req,res)=>{
  try{
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
export default user_router;