const express= require('express')
const authAdmin= require("../middlewares/authAdmin")

const adminRouter= express.Router()

const {adminSignup,adminLogin,deleteUser, adminLogout}= require("../controllers/adminController")

adminRouter.post("/signup",adminSignup)
adminRouter.post("/login",adminLogin)
adminRouter.delete("/delete/:userId",authAdmin,deleteUser)
adminRouter.post("/logout",authAdmin,adminLogout)

module.exports= adminRouter
