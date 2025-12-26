const express= require("express")
const ratingRouter = express.Router()

const{createRating, getRatingsByMovie, updateRating, deleteRating}= require("../controllers/ratingController")
const authUser=require("../middlewares/authUser")

ratingRouter.post("/create",authUser,createRating)
ratingRouter.get("/ratingsbymovie/:movieId",getRatingsByMovie)
ratingRouter.put("/updaterating/:id",authUser,updateRating)
ratingRouter.delete("/deleterating/:ratingId",authUser,deleteRating)

module.exports=ratingRouter