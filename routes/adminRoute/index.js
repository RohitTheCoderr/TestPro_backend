import express from "express";
<<<<<<< HEAD
import { createCategory, updateCategory } from "../../controllers/questionController/categorycontroller.js";
=======
import { createCategory, getcategoriesController, getSingleCategoryController, updateCategory } from "../../controllers/questionController/categorycontroller.js";
>>>>>>> 5798fa4c2897be4d65e26ca3669bbb2db751537e
import { createExamBycategory } from "../../controllers/questionController/examcontroller.js";
import { createTest, updateQuestionImage } from "../../controllers/questionController/testController.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();
<<<<<<< HEAD
// category
router.post("/category/create", createCategory);
router.post("/category/update", updateCategory);
=======

router.get("/category/list", getcategoriesController);
router.get("/category/:categoryID", getSingleCategoryController);
router.post("/category/create", createCategory);
router.patch("/category/update", updateCategory);
>>>>>>> 5798fa4c2897be4d65e26ca3669bbb2db751537e
router.post("/exam/create", createExamBycategory);
router.post("/test/create", createTest);
router.patch(
  "/test/:testID/subjects/:subjectID/questions/:questionID/image",
  upload.single("image"),
  updateQuestionImage
);

export { router as adminRouter };
