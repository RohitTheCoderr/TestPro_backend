import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/mainRoute.js"
import cors from 'cors'

dotenv.config()

connectDB()
const app=express()
app.use(cors())
app.use(express.json())

app.use("/api", router)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
