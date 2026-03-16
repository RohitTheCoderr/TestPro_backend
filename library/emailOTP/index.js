import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
let senderEmail = process.env.EMAIL_USERNAME;
let pass = process.env.EMAIL_APP_PASS;
let host = process.env.EMAIL_HOST;
let port = Number(process.env.EMAIL_PORT);

export const sendOtpEmail = async ({ to, subject, html }) => {
  try {
    if (!senderEmail || !pass) {
      throw new Error("Email environment variables are missing");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: host,
      port: port,
      secure: false,
      auth: {
        user: senderEmail,
        pass: pass,
      },
    });

    // const checkgmian = await transporter.verify();

    await transporter.sendMail({
      from: "Test@Pro.com",
      to: to,
      subject: subject,
      html: html,
    });

    return { success: true, Message: "OTP sent to your Email" };
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};
