import express from "express";
// import { examRoute } from "./examRoutes.js";
import { getcategoryController } from "../../../controllers/questionController/categorycontroller.js";
import { examRoute } from "../examRoute/index.js";
import { getExamsByCategoryController } from "../../../controllers/questionController/examcontroller.js";

const router = express.Router();

// /api/category
router.get("/", getcategoryController);

// Nested route: /api/category/:categoryID/exams
router.get("/:categoryID/exams", getExamsByCategoryController);

export { router as categoryRoute };
