import jwt from "jsonwebtoken";

// const secratekey = process.env.JWT_SECRET;
// const ExprireIn = process.env.JWT_EXPIRES_IN;

export function getitngjwttoken(id) {
const secratekey = process.env.JWT_SECRET;
const ExprireIn = process.env.JWT_EXPIRES_IN;
  if (!secratekey || !ExprireIn) {
    throw new Error("ExprireIn or secratekey not found in env");
  }


  const option = { expiresIn: ExprireIn };
  const payload = { userId: id };
  console.log("payload option", payload, option);
  
  try {
    const token = jwt.sign(payload, secratekey, option);
    console.log("after sign token in jwt library", token);
    
    return token;
  } catch (error) {
    throw new Error("Token generation failed");
  }
}

export function verifyjwttoken(token) {
  const secratekey = process.env.JWT_SECRET;
  if (!secratekey) {
    throw new Error("secretkey is not found in env while token verification");
  }
  try {
    return jwt.verify(token, secratekey);
  } catch (error) {
    throw new Error("Token validator failed");
  }
}
