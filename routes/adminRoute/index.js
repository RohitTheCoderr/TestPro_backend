import express from "express";
import { createCategory } from "../../controllers/questionController/categorycontroller.js";
import { createExamBycategory } from "../../controllers/questionController/examcontroller.js";
import { createTest, updateQuestionImage } from "../../controllers/questionController/testController.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.post("/category/create", createCategory);
router.post("/exam/create", createExamBycategory);
router.post("/test/create", createTest);
router.patch(
  "/test/:testId/subjects/:subjectId/questions/:questionId/image",
  upload.single("image"),
  updateQuestionImage
);

export { router as adminRouter };
