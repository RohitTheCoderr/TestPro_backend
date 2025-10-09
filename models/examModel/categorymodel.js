import mongoose from "mongoose"

const categoryDetails = new mongoose.Schema({
  details: String,
  otherdetails: String,
});

const CategorySchema =new mongoose.Schema({
name:{type:String, }, //SSC, BANKING, RAILWAY 
slug:{type:String},  // ssc, banking, railway
categoryDetails:categoryDetails
})

export default mongoose.model("Category ", CategorySchema )