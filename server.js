import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/mainRoute.js"
import cors from 'cors'

dotenv.config()

connectDB()
const app=express()
// --- Allowed Frontends ---
const allowedOrigins = [
  "http://localhost:3000",        // local dev
  "http://localhost:3001",        // local dev
  "https://testpro-exams.vercel.app"    // live frontend
];

// --- CORS Middleware ---
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json())
app.use("/api", router)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
