import nodemailer from "nodemailer";

const senderEmail = process.env.EMAIL_USERNAME;
const pass = process.env.EMAIL_APP_PASS;
const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;


export const sendOtpEmail = async ({to, subject, html}) => {
  try {
    const genetransport = () => {
      return nodemailer.createTransport({
        service: host === "smpt.gmail.com" ? "gmail" : null,
        host: host,
        port: port,
        secure: false,
        auth: {
          user: senderEmail,
          pass: pass,
        },
      });    
    };

   await genetransport.sendMail({
    from:"Test@Pro.com",
    to:to,
    subject:subject,
    html:html,
   })

   return { success:true,
    Message:"OTP sent to your Email"
   }
  } catch (error) {
    throw error
  }
};
