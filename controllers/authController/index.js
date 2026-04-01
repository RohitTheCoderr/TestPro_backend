import {
  createHashedPassword,
  verifiedhashedpass,
} from "../../library/bcrypt/index.js";
import userModel from "../../models/User.js";

//  for testing controller
export const hello = async (req, res, next) => {
  try {
    res.status(201).json({ message: "Hello user welcome to testPro " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function isUserExits(req, res, next) {
  try {
    const { mobile, email } = req.body;
    console.log("email, mobile", email, mobile);
    
    let exits;
    if (mobile) {
      exits = await userModel.findOne({ mobile });
    } else if (email) {
      exits = await userModel.findOne({ email });
    }

    if (req.originalUrl === "/api/user/auth/send_opt") {
      if (exits)
        return res
          .status(400)
          .json({ success: false, message: "user already Exits" });

      next();
    } else if (req.originalUrl == "/api/user/auth/forget_password") {
      if (exits) return next();

      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
     // Fallback: never hang
    return res.status(400).json({ success: false, message: "Invalid request" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const registerUser = async (req, res, next) => {
  try {
    const userdata = req.body;

    if (!userdata?.email && !userdata?.password && !userdata?.mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or mobile and password",
      });
    }

    let userExists;

    if (userdata?.email) {
      userExists = await userModel.findOne({ email: userdata?.email });
    }

    if (userdata?.mobile) {
      userExists = await userModel.findOne({ mobile: userdata?.mobile });
    }

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    userdata.password = await createHashedPassword(userdata?.password);

    let role = "student";

    // ✅ Check if email/mobile matches admin list in .env
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ||
      [];
    const adminPhones =
      `+91${process.env.ADMIN_PHONES?.split(",").map((p) => p.trim()) || []}`

    if (
      (userdata?.email && adminEmails.includes(userdata.email.toLowerCase())) ||
      (userdata?.mobile && adminPhones.includes(userdata.mobile))
    ) {
      role = "admin";
    }

    const newUser = await userModel.create({
      name: userdata?.name || "Student",
      email: userdata?.email,
      mobile: userdata?.mobile,
      password: userdata?.password,
      role,
    });

    if (newUser._id) {
      req.userId = newUser._id;
      return next();
    } else {
      res
        .status(500)
        .json({
          success: false,
          message: "User not registered. Please try again.",
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};


export const newPassCreation = async (req, res, next) => {
  try {
    const userdata = req.body;

   if ((!userdata?.email && !userdata?.mobile) || !userdata?.password) {
  return res.status(400).json({
    success: false,
    message: "Please provide email or mobile and password",
  });
}

    let userExists;

    if (userdata?.email) {
      userExists = await userModel.findOne({ email: userdata?.email });
    }

    if (userdata?.mobile) {
      userExists = await userModel.findOne({ mobile: userdata?.mobile });
    }

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User Not exists",
      });
    }

    userdata.password = await createHashedPassword(userdata?.password);

    let role = "student";

    // ✅ Check if email/mobile matches admin list in .env
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ||
      [];
    const adminPhones =
      `+91${process.env.ADMIN_PHONES?.split(",").map((p) => p.trim()) || []}`

    if (
      (userdata?.email && adminEmails.includes(userdata.email.toLowerCase())) ||
      (userdata?.mobile && adminPhones.includes(userdata.mobile))
    ) {
      role = "admin";
    }

    const updatedUser = await userModel.findOneAndUpdate(
  { _id: userExists._id },
  {
    password: userdata.password,
    role,
    name: userdata?.name || userExists.name || "Student",
  },
  { new: true }
);

if (updatedUser) {
  req.userId = updatedUser._id;
  return next();
} else {
  return res.status(500).json({
    success: false,
    message: "User not registered. Please try again.",
  });
}
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const reqData = req.body;
    let user;
    if (reqData?.email) {
      user = await userModel.findOne({ email: reqData.email });
    }

    if (reqData?.mobile) {
      user = await userModel.findOne({ mobile: reqData.mobile });
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not exits" });

    const varifiedPass =await verifiedhashedpass(reqData?.password, user.password);

    console.log("varified or not", varifiedPass);
    
    if (user && varifiedPass) {
      req.userId = user._id;
      next();
    } else {
      return res.status(400).json({ message: "invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
