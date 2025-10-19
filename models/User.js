import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "Guest"},   // optional for login
  email: { type: String, unique: true, sparse: true},  // for login/register
  mobile: { type: Number, unique: true, sparse: true}, // should also be unique
  password: { type: String, required: true }, 
  role: { type: String, enum: ["student", "admin"], default: "student" },
  unlockedPackages: [{ type: String }]
},{
   toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.userId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  });

export default mongoose.model("userModel", userSchema)

