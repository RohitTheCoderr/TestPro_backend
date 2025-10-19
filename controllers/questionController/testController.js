// import Exammodel from "../../models/examModel/Exammodel.js";
import AttemptSchema from "../../models/AttemptSchema.js";
import testmodel from "../../models/examModel/textModel.js";
import mongoose from "mongoose";
// import TestModel from "../models/Test.js";

// Create a new test (Admin only)
export const createTest = async (req, res) => {
  try {
    const { examID, title, type, duration, price, subjects } = req.body;

    if (!examID || !title || !subjects || subjects.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const test = await testmodel.create({
      examID,
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
    const { testID, subjectID, questionID } = req.params;

    // 1️⃣ check if file uploaded via Cloudinary
    const imageUrl = req.file?.path;
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // 2️⃣ find test
    const test = await testmodel.findById(testID);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // 3️⃣ find subject by id
    const subject = test.subjects.id(subjectID);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // 4️⃣ find question by id
    const question = subject.questions.id(questionID);
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
    const { examID } = req.params;

    const tests = await testmodel
      .find({ examID })
      .select(" title type duration price examID testID"); // which

    res.status(201).json({
      success: true,
      message: "tests details send successfuly",
      tests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single test by title
export const getTestById = async (req, res) => {
  try {
    const { examID, testID } = req.params;
    const test = await testmodel.findOne({
      examID: new mongoose.Types.ObjectId(examID),
      testID: new mongoose.Types.ObjectId(testID),
    });
    // const test = await testmodel.findOne({ examID, testID });

    if (!test)
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });

    res
      .status(201)
      .json({ success: true, message: "test send successfuly", test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { testID, answers = [] } = req.body;

    if (!testID) {
      res
        .status(401)
        .json({ success: false, message: "testID not provided from frontend" });
    }

    const test = await testmodel.findById(testID);

    let score = 0;
    answers.forEach((element) => {
      // Find the subject by ID
      const subject = test.subjects.find(
        (sub) => sub._id.toString() === element.subjectId
      );
      if (!subject) return;

      // Now questions is an array, so use .find
      const question = subject.questions.find(
        (q) => q._id.toString() === element.questionId
      );
      if (!question) return;

      // Compare answer
      if (question.answer === element.selectedOptionIndex) {
        score += 1;
      }
    });

    const Attempt = new AttemptSchema({
      userId,
      testID,
      answers,
      score,
      submitedAt: new Date(),
    });

    await Attempt.save();

    res
      .status(200)
      .json({ success: true, message: "Test submitted successfully", score });
  } catch (error) {
    console.error("Submit test failed:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
