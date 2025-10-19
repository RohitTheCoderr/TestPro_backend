import express from "express";
import { getAllTestsByExam, getTestById, submitTest, } from "../../../controllers/questionController/testController.js";
import { varifyJwtToken } from "../../../middleware/jwtmiddleware/index.js";

const router = express.Router();

// Protected route - user must be logged in

// Get all tests for an exam
router.get("/:examID", getAllTestsByExam);

// Get single test by title
router.get("/:examID/:testID",varifyJwtToken, getTestById );

router.post("/submit-test",varifyJwtToken, submitTest );

export { router as testRouter };
