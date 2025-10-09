import mongoose from "mongoose";

const { Schema } = mongoose; // ✅ Add this line

const examDetails = new mongoose.Schema({
  details: [],
  negativeMark: Number,
  permark: Number,
  totalQuestion:{type: Number,},
  totalmarks: Number,
  otherdetails: String,
});

const ExamSchema = new mongoose.Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: String, // "CGL, MTS"  // human readable
  slug: String, // e.g. "cgl, mts" // for machine readable
  examDetails: examDetails,
});
export default mongoose.model("Exam", ExamSchema);
