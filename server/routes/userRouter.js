const express= require("express")
const authUser=require("../middlewares/authUser")
const upload= require("../middlewares/multer")


const userRouter= express.Router()
const {signUp,login,checkUser,profile,updateUser,logout}= require("../controllers/userController")

userRouter.post("/signup",signUp)
userRouter.post("/login",login)
 userRouter.get("/profile",authUser,profile)
userRouter.get("/check-user",authUser,checkUser)
userRouter.patch("/update",authUser,updateUser)
userRouter.get("/logout",logout)



module.exports=userRouter