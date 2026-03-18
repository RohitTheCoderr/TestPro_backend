import bcrypt from "bcrypt";



export async function createHashedPassword(simplePass) {
  try {
    const pass_key = process.env.PASSWORD_SECRET_KEY 
    console.log("passleje", pass_key);
    
    const saltround = 12;
    if (!simplePass) throw new Error("Password required");
    if (!pass_key) {
      throw new Error("Missing PASSWORD_SECRET_KEY");
    }

    const createsalt = await bcrypt.genSalt(saltround);
    return await bcrypt.hash(simplePass + pass_key, createsalt);
  } catch (error) {
    console.error("Password hashing error:", error);

    throw new Error("Password hashing failed.");
  }
}

export async function verifiedhashedpass(simplePass, hashedPass) {
  try {
    // console.log("passkey", pass_key);
const pass_key=process.env.PASSWORD_SECRET_KEY

    if (!pass_key) {
      throw new Error("Missing PASSWORD_SECRET_KEY");
    }
    return await bcrypt.compare(simplePass + pass_key, hashedPass);
  } catch (error) {
    throw new Error("hashed password not verified, something went wrong");
  }
}
