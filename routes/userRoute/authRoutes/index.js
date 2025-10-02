import express from "express";
import { hello, isUserExits, loginUser, registerUser } from "../../../controllers/authController/index.js";
import { generateOtpmiddleware, otpVerification } from "../../../middleware/otpmiddleware/index.js";
import { VerifySmsOtp } from "../../../library/otpLess/index.js";
import { createJwttoken, varifyJwtToken } from "../../../middleware/jwtmiddleware/index.js";

const router = express.Router();

router.get("/hello", hello);  // for testing only

router.post("/send_opt", isUserExits, generateOtpmiddleware);

router.post("/register", otpVerification, registerUser, createJwttoken);
// router.post("/register", registerUser, createJwttoken);

router.post("/login", loginUser, createJwttoken);
// router.post("/forget_password", loginUser);

// router.post("/create_profile", loginUser);
// router.post("/update_profile", loginUser);

export {router as authRoutes};
