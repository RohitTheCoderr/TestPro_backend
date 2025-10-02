import mongoose, { mongo } from "mongoose";
import userModel from "../models/User.js"
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
      // Sync indexes for userModel (ensures sparse unique indexes are applied)
    await userModel.syncIndexes();
    console.log("User indexes synced");

    console.log("database connected successfully");
  } catch (error) {
    console.error("database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;