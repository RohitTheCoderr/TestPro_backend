import categorymodel from "../../models/examModel/categorymodel.js";
import Exammodel from "../../models/examModel/Exammodel.js";
// import ExamTest from "../models/Test.js";

// GET /api/category/:slug/exams
export const getExamsByCategoryController = async (req, res) => {
  try {
    const { categoryID } = req.params;

    const category = await categorymodel.findById(categoryID);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const exams = await Exammodel.find({ categoryID: category._id });
    res.json({ success: true, data: { category, exams } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExamBycategory = async (req, res, next) => {
  try {
    const { categoryID, name, slug, examDetails } = req.body;
    console.log("detals", categoryID, name, slug, examDetails);

    if (!categoryID || !name || !slug || !examDetails)
      return res.status(400).json({
        success: false,
        message: "categoryId, name, examDetails and slug required",
      });

    const category = await categorymodel.findById(categoryID);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    slug = slug.toLowerCase();
    const isExam = await Exammodel.findOne({ slug: slug });
    if (isExam) {
      res.status(202).json({
        seccess: false,
        message: "Exam already exits",
      });
    }
    if (!isExam) {
      const exam = await Exammodel.create({
        name,
        slug,
        categoryID: category.categoryID,
        examDetails,
      });
      res.status(201).json({
        success: true,
        message: "Exam created successfuly",
        data: { exam },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExamBycategoryController = async (req, res, next) => {
  try {
    const { categoryID, ExamID, name, slug, examDetails, status } = req.body();

    if (!ExamID) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide ExamID" });
    }

    const isDuplicate = await Exammodel.findOne({
      _id: { $ne: ExamID },
      $or: [{ name }, { slug }],
    });

    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        message: "this Exam name Already exits in this category",
      });
    }

    const updated = await Exammodel.findByIdAndUpdate(
      ExamID,
      {
        name,
        slug,
        status,
        categoryID,
        examDetails,
      },
      {
        new: true, // return updated doc
        runValidators: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Exam not exists",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// for exam details
// export const getExamDetails = async (req, res) => {
//   try {
//     const exam = await ExamTest.findOne({ slug: req.params.slug }).populate("category");
//     if (!exam) return res.status(404).json({ message: "Exam not found" });

//     const examTests = await ExamTest.findOne({ exam: exam._id });
//     res.json({ success: true, exam, examTests });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
