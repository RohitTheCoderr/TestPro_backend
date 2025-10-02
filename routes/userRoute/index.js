import express from "express";
import { authRoutes } from "./authRoutes/index.js";

const router = express.Router();

// User routes
router.use("/auth", authRoutes);
// router.use("/tests", testRoutes);
// router.use("/questions", questionRoutes);
// router.use("/payments", paymentRoutes);
// router.use("/results", resultRoutes);
// router.use("/packages", packageRoutes);

 export { router as userRoute };
