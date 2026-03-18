import express from "express";
import { hello, isUserExits, loginUser, newPassCreation, registerUser } from "../../../controllers/authController/index.js";
import { generateOtpmiddleware, otpVerification } from "../../../middleware/otpmiddleware/index.js";
import { createJwttoken, } from "../../../middleware/jwtmiddleware/index.js";

const router = express.Router();

router.get("/hello", hello);  // for testing only

router.post("/send_opt", isUserExits, generateOtpmiddleware);
router.post("/forget_password", isUserExits, generateOtpmiddleware);

router.post("/register", otpVerification, registerUser, createJwttoken);
router.post("/reset_password", otpVerification, newPassCreation, createJwttoken);

router.post("/login", loginUser, createJwttoken);

export {router as authRoutes};
