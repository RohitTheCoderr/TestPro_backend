import mongoose from "mongoose";
const { Schema } = mongoose;

// Each question
const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: Number, required: true }, // correct option index
  details: { type: String },
  image: { type: String, default: null }, // ✅ Image URL (e.g. from Cloudinary)
});

// Each subject inside a test
const SubjectSchema = new Schema({
  name: { type: String, required: true },
  questions: [QuestionSchema],
});

// Main Test schema
const TestSchema = new Schema({
  exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  title: { type: String, required: true }, // Test 1, Test 2
  type: { type: String, enum: ["free", "paid"], default: "free" },
  duration: { type: Number, default: 60 }, // in minutes
  price: { type: Number, default: 0 },
  subjects: [SubjectSchema],
}, { timestamps: true });

export default mongoose.model("Test", TestSchema);
