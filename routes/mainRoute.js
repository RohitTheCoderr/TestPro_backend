import express from "express";
import { userRoute } from "./userRoute/index.js";

const router = express.Router();

router.use("/user", userRoute);
// router.use("/admin", loginUser);

export default router;
