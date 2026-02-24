import categorymodel from "../../models/examModel/categorymodel.js";
import Exammodel from "../../models/examModel/Exammodel.js";
// import ExamTest from "../models/Test.js";

// GET /api/category/:categoryID/exams
export const getExamsByCategoryController = async (req, res) => {
  try {
    const { categoryID } = req.params;
    // const category = await categorymodel.findById(categoryID );
    const category = await categorymodel.find({_id:categoryID, status:true} );
     
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const exams = await Exammodel.find({ categoryID, status:true });
    res.json({ success: true, data: { category, exams } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllExamsController = async (req, res) => {
  try {
    const { categoryID } = req.params;

    const category = await categorymodel.findById(categoryID );
    
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const exams = await Exammodel.find({ categoryID: category._id });
    res.status(201).json({ success: true, message: "Data send successfully", data: { category, exams } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleExamController = async (req, res) => {
  try {
    const { examID } = req.params;

    if (!examID) {
      return res.status(401).json({success:false, message:"Please provide ExamID", data:{}})
    }
    const exam = await Exammodel.findById(examID);
    if (!exam) {
     return res.status(404).json({success:false, message:"Exam Not found", data:{}})
    }
    res.status(201).json({ success: true, message:"Exam send successfully", data: { exam } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExamBycategory = async (req, res, next) => {
  try {
    const { categoryID, name, slug, examDetails } = req.body;

    if (!categoryID || !name || !slug || !examDetails)
      return res.status(400).json({
        success: false,
        message: "categoryId, name, examDetails and slug required",
      });

    const category = await categorymodel.findById(categoryID);
    
    if (!category){
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });}

    const exam = await Exammodel.create({
      name,
      slug,
      categoryID: category._id,
      examDetails,
    });

    
    res.status(201).json({
      success: true,
      message: "Exam created successfuly",
      data: { exam },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateExamByID = async (req, res, next) => {
  try {
    let { ExamID, name, slug, examDetails, status } = req.body;

    if (!ExamID) {
     return res.status(400).json({success:false, message:"please provide ExamID", data:{} })
    }

    if (slug) slug = slug.toLowerCase();

    const exam = await Exammodel.findByIdAndUpdate(ExamID,{
      name,
      slug,
      status,
      examDetails,
    }, 
    {
        new: true,       // return updated doc
        runValidators: true,
      });

      if (!exam) {
        res.status(404).json({
      success: false,
      message: "Exam not found",
      data: exam ,
    });
      }

    res.status(201).json({
      success: true,
      message: "Exam Updated successfuly",
      data: { exam },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

updateExamByID