const user=require("../models/userModel")
const bcrypt=require("bcrypt")
const createToken=require("../utils/generateToken")
const {cloudinaryInstance}= require("../config/cloudinary")


const signUp=async(req,res)=>{

   try {
     const{name,email,password,phone}=req.body||{}
     console.log(req.body);
     
     
     if (!name || !email || !password ) {
       return res.status(400).json({ message: "Name, email, and password are required." });
     }
     

    const userExists=await user.findOne({email})
    if(userExists){
       return res.status(400).json({message:"user already exist"})

    }
    const salt= await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    

    const newUser=new user({name,email,password:hashedPassword,phone})
    const savedUser=await newUser.save()
     
    
     
     return res.status(201).json({message:"user created successfully",savedUser})
    
   } catch (error) {
    console.log(error);
    return res.status(error.status||500).json({error:error.message||"internal server error"})
    
   }

}

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const userExists = await user.findOne({ email });
    if (!userExists) {
      return res
        .status(400)
        .json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password" });
    }

  
    const userObject = userExists.toObject();
    delete userObject.password;

   
    const token = createToken(
      userExists._id,
      userExists.role
    );

  
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

   
    return res.status(200).json({
      success: true,
      token,
      userObject
    });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};

const checkUser=async(req,res)=>{
  try {
    res.json({messsage:"authorized user",loggedinUser:req.user.id})
  } catch (error) {
     console.log(error);
     return res.status(error.status||500).json({error:error.message||"internal server error"})
    
  }
}
const profile=async(req,res)=>{
  try {
   
    const userId = req.user.id
    const userData= await user.findById(userId).select("-password")
.populate({
        path: "bookings",
        populate: [
          { path: "movie", model: "movie" },
          { path: "theatre", model: "Theatre" },
          { path: "show", model: "show" }
        ]
  })
      
    res.json({data:userData})

  } catch (error) {
     console.log(error);
     return res.status(error.status||500).json({error:error.message||"internal server error"})
    
  }
}
const updateUser = async (req,res)=>{
  try{
  const{name,email,password,phone,address}=req.body||{}
  const userId= req.user.id
  const userData= await user.findByIdAndUpdate(userId,{name,email,password,phone,address},{new:true},{runValidators:true})
  res.json({data:userData})

}catch (error) {
     console.log(error);
     return res.status(error.status||500).json({error:error.message||"internal server error"})
} 
}

const logout= async(req,res)=>{
  try{
  res.clearCookie("token")
  res.json({message:'logout successfully'})
} catch(error){
   console.log(error);
     return res.status(error.status||500).json({error:error.message||"internal server error"})
}
}
module.exports={signUp,login,checkUser,profile,updateUser,logout}