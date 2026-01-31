import mongoose from "mongoose";

const categoryDetails = new mongoose.Schema({
  details: String,
  otherdetails: String,
});

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String }, //SSC, BANKING, RAILWAY
    slug: { type: String }, // ssc, banking, railway
    categoryDetails: categoryDetails,
<<<<<<< HEAD
    status:{type:Boolean}
=======
    status:{type: Boolean, default: true,}
>>>>>>> 5798fa4c2897be4d65e26ca3669bbb2db751537e
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.categoryID = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model("Category ", CategorySchema);
