const express= require("express")

const showRouter= express.Router()

const{createShow,fetchAllShows,fetchShowById,updateShow,fetchShowsByMovie,deleteShow}=require("../controllers/showController")


showRouter.post("/create",createShow)
showRouter.get("/allshows",fetchAllShows)
showRouter.get("/showbyid/:id",fetchShowById)
showRouter.get("/movie/:movieId", fetchShowsByMovie);
showRouter.put("/update/:id",updateShow)
showRouter.delete("/delete/:id",deleteShow)


module.exports=showRouter