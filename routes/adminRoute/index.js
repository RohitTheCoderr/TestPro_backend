import express from "express";
import { createCategory, getcategoriesController, getSingleCategoryController, updateCategory } from "../../controllers/questionController/categorycontroller.js";
import { createExamBycategory, getAllExamsController, getSingleExamController, updateExamByID } from "../../controllers/questionController/examcontroller.js";
import { createTest, getAllTestsByExamID, updateQuestionImage } from "../../controllers/questionController/testController.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();
// category
router.post("/category/create", createCategory);
router.patch("/category/update", updateCategory);

router.get("/category/list", getcategoriesController);
router.get("/category/:categoryID", getSingleCategoryController);

router.get("/:categoryID/exams/list", getAllExamsController);
router.get("/exam/:examID", getSingleExamController);
router.post("/exam/create", createExamBycategory);
router.patch("/exam/update", updateExamByID);

router.get("/test/list/:examID", getAllTestsByExamID);
router.post("/test/create", createTest);
router.patch("/test/update", createTest);


router.patch(
  "/test/:testID/subjects/:subjectID/questions/:questionID/image",
  upload.single("image"),
  updateQuestionImage
);

export { router as adminRouter };
