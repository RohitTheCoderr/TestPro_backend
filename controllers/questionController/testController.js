// import Exammodel from "../../models/examModel/Exammodel.js";
import testmodel from "../../models/examModel/textModel.js";

// import TestModel from "../models/Test.js";

// Create a new test (Admin only)
export const createTest = async (req, res) => {
  try {
    const { examId, title, type, duration, price, subjects } = req.body;

    if (!examId || !title || !subjects || subjects.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const test = await testmodel.create({
      exam: examId,
      title,
      type,
      duration,
      price,
      subjects,
    });

    res
      .status(201)
      .json({ success: true, message: "Test created successfully", test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateQuestionImage = async (req, res) => {
  try {
    const { testId, subjectId, questionId } = req.params;

    // 1️⃣ check if file uploaded via Cloudinary
    const imageUrl = req.file?.path;
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // 2️⃣ find test
    const test = await testmodel.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // 3️⃣ find subject by id
    const subject = test.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // 4️⃣ find question by id
    const question = subject.questions.id(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // 5️⃣ update image
    question.image = imageUrl;

    // 6️⃣ save test
    await test.save();

    res.json({
      success: true,
      message: "Question image updated successfully",
      question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Get all tests for an exam
export const getAllTestsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const tests = await testmodel
      .find({ exam: examId })
      .select("exam title type duration price");

    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single test by title
export const getTestByTitle = async (req, res) => {
  try {
    const { examId, testTitle } = req.params;

    const test = await testmodel.findOne({ exam: examId, title: testTitle });
    if (!test)
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });

    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getSingleTest = async (req, res) => {
//   try {
//     const { examId, subjectName, testTitle } = req.params;

//     const examTest = await testmodel.findOne({ exam: examId });
//     if (!examTest) return res.status(404).json({ message: "Exam not found" });

//     const subject = examTest.subjects.find(
//       s => s.name.toLowerCase() === subjectName.toLowerCase()
//     );
//     if (!subject) return res.status(404).json({ message: "Subject not found" });

//     const test = subject.tests.find(
//       t => t.title.toLowerCase() === testTitle.toLowerCase()
//     );
//     if (!test) return res.status(404).json({ message: "Test not found" });

//     res.json({ success: true, test });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const uploadTestController = async (req, res) => {
//   try {
//     const { examId, subjects } = req.body;

//      if (!examId || !subjects || subjects.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Exam ID and subjects are required.",
//       });
//     }
//      // ✅ Check if exam exists
//     const examExists = await Exammodel.findById(examId);
//     if (!examExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found. Please select a valid exam.",
//       });
//     }
//   // ✅ Create Test document
//     const newTest = await testmodel.create({
//       exam: examId,
//       subjects,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Test created successfully.",
//       data: newTest,
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
