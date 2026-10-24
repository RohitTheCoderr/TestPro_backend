import express from "express";
import {
  deleteTestResult,
  getAllTestsByExam,
  getTestById,
  getTestResultDetails,
  submitTest,
  testsResult,
} from "../../../controllers/questionController/testController.js";
import { verifyJwtToken } from "../../../middleware/jwtmiddleware/index.js";

const router = express.Router();

// Protected route - user must be logged in
router.get("/testsresult", verifyJwtToken, testsResult);
router.get("/testsresult/:attemptID", verifyJwtToken, getTestResultDetails);
router.delete("/testsresult/:attemptID", verifyJwtToken, deleteTestResult);

router.post("/submit-test", verifyJwtToken, submitTest);

// Get all tests for an exam
router.get("/:examID", getAllTestsByExam);

// Get single test by title
router.get("/:examID/:testID", verifyJwtToken, getTestById);

export { router as testRouter };
