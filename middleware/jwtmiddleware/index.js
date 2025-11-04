import jwt from "jsonwebtoken";

import userModel from "../../models/User.js";
import { getitngjwttoken, verifyToken } from "../../library/jwt/index.js";

export const createJwttoken = (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId not found" });
    }

    const token = getitngjwttoken(userId); // jwt token gen need

    return res.status(202).json({
      success: true,
      message: "Token generatedd successfully",
      data: { token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const varifyJwtToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decodetoken = verifyToken(token);
      req.userId = decodetoken.userId;
      console.log("hhhhh");
      

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


export const verifyAdmin = async (req, res, next) => {
  varifyJwtToken(req, res, async () => {
    const user = await userModel.findById(req.userId);
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied! Admins only." });
    }
  });
};