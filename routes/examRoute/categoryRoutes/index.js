import express from "express";
// import { examRoute } from "./examRoutes.js";
import { getcategoryController } from "../../../controllers/questionController/categorycontroller.js";
import { examRoute } from "../examRoute/index.js";
import { getExamsByCategoryController } from "../../../controllers/questionController/examcontroller.js";

const router = express.Router();

// /api/category
router.get("/", getcategoryController);

// Nested route: /api/category/:slug/exams
router.get("/:slug/exams", getExamsByCategoryController);

// Attach exam route (for exam details)
// router.use("/exam", examRoute);

export { router as categoryRoute };
