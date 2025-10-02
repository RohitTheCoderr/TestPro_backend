 import mongoose from "mongoose";

 const optSchema=new mongoose.Schema({
    email:{type:"string"},
    mailOtp:{type:"string"},
    expiresAt:{type:Date, require:true,},
 })
 optSchema.index({"expiresAt":1}, {expireAfterSeconds:1})

 export const otpModel=mongoose.model("OTP", optSchema)

 