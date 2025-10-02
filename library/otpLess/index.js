import pkg from "otpless-node-js-auth-sdk";
const { sendOTP, verifyOTP } = pkg;

export const SmsOtp = async (mobile, channel) => {
  let clientId = process.env.OTPLESS_CLIENT_ID || "";
  let secretId = process.env.OTPLESS_CLIENT_SECRET || "";
  let otpExpTime = process.env.OTPLESS_EXPIRY_TIME || "";
  let otpLength = process.env.OTPLESS_LENGTH || "";

  try {
    console.log("env", clientId, secretId, otpExpTime, otpLength);

    if (!clientId || !secretId || !otpExpTime || !otpLength) {
      console.log(
        "OTPLESS_CLIENT_ID OR OTPLESS_CLIENT_SECRET OR OTPLESS_EXPIRY_TIME OR OTPLESS_LENGTH may not in .env"
      );
    }

    const response = await sendOTP(
      mobile,
      null,
      channel,
      null,
      null,
      Number(otpExpTime),
      otpLength,
      clientId,
      secretId
    );

    console.log("response", response);

    if (response.hasOwnProperty("success") && !response.success) {
      return { success: false, message: "server error" };
    }

    console.log("response after if", response);
    return { success: true, message: response.orderId };
  } catch (error) {
    return {
      success: false,
      message: err,
    };
  }
};

export const VerifySmsOtp = async (mobile, orderId, otp) => {
  let clientId = process.env.OTPLESS_CLIENT_ID || "";
  let secretId = process.env.OTPLESS_CLIENT_SECRET || "";
  let otpExpTime = process.env.OTPLESS_EXPIRY_TIME || "";
  let otpLength = process.env.OTPLESS_LENGTH || "";
  try {
    console.log("vrief", clientId, secretId, otpExpTime, otpLength);

    if (!clientId || !secretId || !otpExpTime || !otpLength) {
      console.log(
        "OTPLESS_CLIENT_ID OR OTPLESS_CLIENT_SECRET OR OTPLESS_EXPIRY_TIME OR OTPLESS_LENGTH may not in .env"
      );
    }

    // const isValidotp = await verifyOTP(
    //   null,
    //   mobile,
    //   orderId,
    //   otp,
    //   clientId,
    //   secretId,
    // );

    const isValidotp = await verifyOTP(
      null, // email (not needed for SMS)
      mobile, // same mobile number
      orderId, // use response.orderId from sendOTP
      otp, // user entered OTP
      clientId,
      secretId,
      otpLength // must match the one you used while sending
    );

    console.log("isValidotp", isValidotp);

    if (isValidotp && Object.keys(isValidotp).length) {
      if (!isValidotp.isOTPVerified) {
        return { success: false, message: "Invalid OTP" };
      }
    }
    console.log("isValidotp after", isValidotp);

    return { success: true, message: "OTP verified" };
  } catch (error) {
    return { success: false, message: error };
  }
};
