import express from "express";
import { createCategory, getcategoriesController, getSingleCategoryController, updateCategory } from "../../controllers/questionController/categorycontroller.js";
import { createExamBycategory } from "../../controllers/questionController/examcontroller.js";
import { createTest, updateQuestionImage } from "../../controllers/questionController/testController.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.get("/category/list", getcategoriesController);
router.get("/category/:categoryID", getSingleCategoryController);
router.post("/category/create", createCategory);
router.patch("/category/update", updateCategory);
router.post("/exam/create", createExamBycategory);
router.post("/test/create", createTest);
router.patch(
  "/test/:testID/subjects/:subjectID/questions/:questionID/image",
  upload.single("image"),
  updateQuestionImage
);

export { router as adminRouter };
