const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const createToken = require("../utils/generateToken");
const userModel = require("../models/userModel");

const adminSignup= async(req,res)=>{

try {
    
    const{name,email,password,profilepic,phone}=req.body||{}

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
  
    const existingAdmin= await User.findOne({email ,role: "admin"})
    if(existingAdmin){
       return res.status(400).json({message:"admin already exist"})

    }
    const salt = await bcrypt.genSalt(10)
    const hashedpassword= await bcrypt.hash(password,salt)

     const newAdmin = new User({
      name,
      email,
      password:hashedpassword,
      profilepic,
      phone,
      role: "admin",
    });

    const savedAdmin= await newAdmin.save()
    
    return res.status(201).json({ message: "Admin created successfully", savedAdmin });


} catch (error) {
     console.log(error);
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(400).json({ message: "Admin does not exist or not authorized." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const adminObject = admin.toObject();
    delete adminObject.password;

    const token = createToken(admin._id, "admin");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({message: "Admin login successful",admin: adminObject,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};
const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Admin logged out successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Logout failed"
    });
  }
};




const deleteUser=async (req,res)=>{
  try {

    const userID = req.params?.userId
    if(!userID){
      return res.status(400).json({message:"userid is required"})
    }
    const userData= await User.findByIdAndDelete(userID)
    if(!userData){
     return res.status(404).json({message:'user not found'})
    }
    res.json({message:"user deleted successfully"})
  } catch (error) {
    console.log(error);
     return res.status(error.status||500).json({error:error.message||"internal server error"})
  }
}



module.exports={adminSignup,adminLogin,adminLogout,deleteUser}

