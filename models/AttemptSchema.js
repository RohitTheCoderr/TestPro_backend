import mongoose from "mongoose";

const AttemptSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  testID: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  answers: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test.subjects",
        required: true,
      },
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedOptionIndex: { type: Number, required: true },
    },
  ],
  score:{type:Number, default:0},
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Attempt", AttemptSchema)
