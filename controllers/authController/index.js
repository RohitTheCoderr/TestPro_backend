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

    console.log("data exit", mobile, email);

    let exits;
    if (mobile) {
      console.log("findmodel", mobile);

      exits = await userModel.findOne({ mobile });

      console.log("aftercheckmodel", exits);
    } else if (email) {
      exits = await userModel.findOne({ email });
    }

    console.log("exits", exits);

    if (req.originalUrl === "/api/user/auth/send_opt") {
      console.log("check", exits);

      if (exits)
        return res
          .status(400)
          .json({ success: false, message: "user already Exits" });

      console.log("before next");

      next();
    } else if (req.originalUrl == "/api/user/auth/forget_password") {
      if (exits) return next();

      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    console.log("not read if else");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const registerUser = async (req, res, next) => {
  try {
    const userdata = req.body;

    console.log("after otp varified userdata", userdata);
    // userdata?.name

    if (!userdata?.email && !userdata?.password && !userdata?.mobile) {
      return res.status(401).json({
        success: false,
        message: "please provide name, email or mobile and password",
      });
    }

    console.log("after otp varified and condition userdata", userdata);
    let userExists;

    if (userdata?.email) {
      userExists = await userModel.findOne({ email: userdata?.email });
    }

    if (userdata?.mobile) {
      userExists = await userModel.findOne({ mobile: userdata?.mobile });
    }

    console.log("userExists", userExists);

    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists", data: {} });

    console.log("before hashed pass", userdata);

    userdata.password = await createHashedPassword(userdata?.password);

    console.log("after hashed pass", userdata);

    const user = await userModel.create(userdata);

    if (user._id) {
      req.userId = user._id;
      console.log("after created user model user", user);

      return next();
    } else {
      res
        .status(500)
        .json({ success: false, message: "User not registered", data: {} });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // let user;
    // if (reqData?.email) {
    //   user = await userModel.findById(reqData?.email);
    // }

    // if (reqData?.mobile) {
    //   user = await userModel.findById(reqData?.mobile);
    // }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not exits" });

    const varifiedPass = verifiedhashedpass(reqData?.password, user.password);

    if (user && (await varifiedPass)) {
      req.userId = user._id;
      next();
    } else {
      return res.status(400).json({ message: "invalid email or password" });
    }

    // const createToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1d",
    // });

    // res.status(200).json({
    //   message: "Logged In successful",
    //   token: createToken,
    //   data: user,
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
