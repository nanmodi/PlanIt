import { Router } from "express";
import dotenv from "dotenv";
import { User } from "../db/userdb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const user_router = Router();


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  maxAge: 60 * 60 * 1000, // 1 hour
};


user_router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Register payload:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, cookieOptions);

    // Optional: Send plain cookie for name if you need it client-side
    res.cookie("name", newUser.name, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      name: newUser.name,
      email: newUser.email,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Route
user_router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login payload:", req.body);

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, cookieOptions);

    res.cookie("name", user.name, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 60 * 60 * 1000,
    });

    console.log("Cookies set:", req.cookies);
    res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout Route
user_router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default user_router;
