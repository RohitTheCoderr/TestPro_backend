import bcrypt from "bcrypt";
const pass_key = process.env.PASSWORD_SECRET_KEY || "default_test_key";
console.log("passkey", pass_key) 


export async function createHashedPassword(simplePass) {
  try {
    console.log("inside hashed pass", simplePass);
    
    const saltround = 12;
    if (!pass_key) {
      throw new Error("Missing PASSWORD_SECRET_KEY");
    }

    console.log("inside hashed pass after salt varified", simplePass);

    const createsalt = await bcrypt.genSalt(saltround);
     console.log("inside hashed pass after salt gen", createsalt);

    return await bcrypt.hash(simplePass + pass_key, createsalt);
  } catch (error) {
    console.log("error", error);
    
    throw new Error("not generated hashed password something went wrong");

  }
}

export async function verifiedhashedpass(simplePass, hashedPass) {
  try {
    if (!pass_key) {
        throw new Error("Missing PASSWORD_SECRET_KEY");
    }
    return await bcrypt.compare(simplePass+pass_key, hashedPass)
  } catch (error) {
    throw new Error("hashed password not verified, something went wrong");
  }
}
