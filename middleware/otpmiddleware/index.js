import { json } from "express";
import { sendOtpEmail } from "../../library/emailOTP/index.js";
import { SmsOtp, VerifySmsOtp } from "../../library/otpLess/index.js";
import { otpModel } from "../../models/otpModel.js";

export const generateOtpmiddleware = async (req, res, next) => {
  try {
    const email = req.body?.email;
    const mobile = req.body?.mobile;

    if (!mobile && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or mobile",
        data: {},
      });
    }

    let result, mailOtp;

    if (email) {
      mailOtp = Math.floor(100000 + Math.random() * 900000);

      result = await sendOtpEmail({
        to: email,
        subject: "Verify Your TestPro Account",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>TestPro OTP Verification</h2>
      <p>Dear User,</p>
      <p>Your One-Time Password (OTP) for account verification is: 
        <strong>${mailOtp}</strong>
      </p>
      <p>This OTP is valid for the next <strong>10 minutes</strong>. Please enter it on the TestPro website to continue.</p>
      <p>If you did not request this verification, please ignore this email or contact our support team immediately.</p>
      <p>Thank you for choosing <strong>TestPro</strong> – your trusted platform for government exam mock tests!</p>
      <p>Best regards,<br>
      TestPro Support Team<br>
      <a href="mailto:support@testpro.com">support@testpro.com</a></p>
    </div>
  `,
      });
    }

    if (mobile) {
      // result = await SmsOtp(mobile, "SMS");  // I use free services so sms not active
      result = await SmsOtp(mobile, "WHATSAPP");
    }

    if (result?.success) {
      const otpID = result?.message?.startsWith("Otp")
        ? result?.message
        : false;

      if (mailOtp && email) {
        let expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        if (await otpModel.findOne({ email })) {
          await otpModel.findOneAndUpdate({ email }, { mailOtp, expiresAt });
        } else {
          await otpModel.create({ email, mailOtp, expiresAt });
        }
      }

      return res.status(201).json({
        success: true,
        message: "OTP sent successfully",
        data: { otpID },
      });
    } else
      return res
        .status(500)
        .json({ success: false, message: "OTP not generated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export async function otpVerification(req, res, next) {
  try {
    const { otp, otpID, mobile, email } = req.body;

    if (!otp || (!mobile && !email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide OTP and email or mobile.",
        data: {},
      });
    }

    // Require exactly one verification method.
    if (email && mobile) {
      return res.status(400).json({
        success: false,
        message: "Please verify using email or mobile, not both.",
        data: {},
      });
    }

    let result;

    if (email) {
      const check = await otpModel.findOne({ email });

      if (!check) {
        return res.status(400).json({
          success: false,
          message: "OTP not found or already used. Please generate a new OTP.",
          data: {},
        });
      }

      if (!check.expiresAt || check.expiresAt <= new Date()) {
        await otpModel.findOneAndDelete({ email });

        return res.status(410).json({
          success: false,
          message: "OTP expired. Please generate a new OTP.",
          data: {},
        });
      }

      if (String(check.mailOtp) !== String(otp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP. Please try again.",
          data: {},
        });
      }

      await otpModel.findOneAndDelete({ email });

      result = {
        success: true,
        message: "OTP verified successfully.",
        data: {},
      };
    } else if (mobile) {
      if (!otpID) {
        return res.status(400).json({
          success: false,
          message: "Please provide otpID.",
          data: {},
        });
      }

      result = await VerifySmsOtp(mobile, otpID, otp);

      if (!result?.success) {
        return res.status(400).json({
          success: false,
          message: result?.message || "Invalid OTP. Please try again.",
          data: {},
        });
      }
    }

    if (result?.success) {
      delete req.body.otp;
      delete req.body.otpID;

      return next();
    }

    return res.status(400).json({
      success: false,
      message: result?.message || "OTP verification failed.",
      data: {},
    });
  } catch (error) {
    return next(error);
  }
}
