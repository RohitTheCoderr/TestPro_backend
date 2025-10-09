import express from "express";
import { userRoute } from "./userRoute/index.js";
import { categoryRoute } from "./examRoute/categoryRoutes/index.js";
import { adminRouter } from "./adminRoute/index.js";
import { verifyAdmin } from "../middleware/jwtmiddleware/index.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/category", categoryRoute);
router.use("/admin", verifyAdmin, adminRouter);

export default router;
