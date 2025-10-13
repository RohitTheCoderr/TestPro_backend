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
  categoryID: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: String, // "CGL, MTS"  // human readable
  slug: String, // e.g. "cgl, mts" // for machine readable
  examDetails: examDetails,
},{
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.ExamID = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }

);
export default mongoose.model("Exam", ExamSchema);
