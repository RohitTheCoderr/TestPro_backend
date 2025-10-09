import express from "express";
import { getAllTestsByExam, getTestByTitle } from "../../../controllers/questionController/testController.js";
import { varifyJwtToken } from "../../../middleware/jwtmiddleware/index.js";

const router = express.Router();

// Protected route - user must be logged in

// Get all tests for an exam
router.get("/:examId", getAllTestsByExam);

// Get single test by title
router.get("/:examId/:testTitle",varifyJwtToken, getTestByTitle );

export { router as testRouter };
