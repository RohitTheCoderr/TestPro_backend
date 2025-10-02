import jwt from "jsonwebtoken";
import { getitngjwttoken, verifyjwttoken } from "../../library/jwt/index.js";

export const createJwttoken = (req, res, next) => {
  try {
    const userId = req.userId;

    console.log("while token middleware", userId);
    

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId not found" });
    }

    console.log(" after conditon!userId", userId);
    

    const token = getitngjwttoken(userId); // jwt token gen need

console.log("after token gene", token);


    return res.status(202).json({
      success: true,
      message: "Token generatedd successfully",
      data: { token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const varifyJwtToken = () => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decodetoken = verifyjwttoken(token);
      req.userId = decodetoken.userId;

      if (req.userId) {
        return next();
      } else {
        throw new Error("token not verified");
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Header authrization mising" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong faild to verified token",
      });
  }
};
