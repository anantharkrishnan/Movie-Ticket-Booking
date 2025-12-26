const express= require("express")

const router= express.Router()

const userRouter= require("./userRouter")
const adminRouter= require("./adminRouter")
const movieRouter= require("./movieRouter")
const theatreRouter= require("./theatreRouter")
const showRouter= require("./showRouter")
const bookingRouter= require("./bookingRouter")
const ratingRouter= require("./ratingRouter")
const comingSoonRouter= require("./comingSoonRouter")
const seatRouter = require("./seatRouter.js")
const paymentRouter= require("./paymentRouter.js")


router.use("/user",userRouter)
router.use("/admin",adminRouter)
router.use("/movie",movieRouter)
router.use("/theatre",theatreRouter)
router.use("/show",showRouter)
router.use("/booking",bookingRouter)
router.use("/rating",ratingRouter)
router.use("/comingsoon",comingSoonRouter)
router.use("/seat",seatRouter)
router.use("/payment",paymentRouter)


module.exports=router