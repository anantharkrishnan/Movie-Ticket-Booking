 const express= require("express")
 const bookingRouter = express.Router()

 const{ getAllBookings,deleteBooking, confirmBooking, getMyBookings}=require("../controllers/bookingController")
 const authUser= require("../middlewares/authUser")

 bookingRouter.post("/confirm",authUser,confirmBooking)
bookingRouter.get("/allbookings",getAllBookings)
bookingRouter.get("/my-bookings",authUser,getMyBookings)
bookingRouter.delete("/delete/:id",deleteBooking)

 module.exports= bookingRouter



