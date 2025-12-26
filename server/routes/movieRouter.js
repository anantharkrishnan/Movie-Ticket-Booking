const express= require("express")
const movieRouter= express.Router()
const movieUpload= require("../middlewares/multer")
const authAdmin= require("../middlewares/authAdmin")

const {createMovie,getAllMovies,getMovieById,updateMovie,deleteMovie} = require("../controllers/movieController")

movieRouter.post("/create",authAdmin,movieUpload,createMovie)
movieRouter.get("/allmovies",getAllMovies)
movieRouter.get("/moviebyid/:id",getMovieById)
movieRouter.put("/update/:id",movieUpload,authAdmin,updateMovie)
movieRouter.delete("/delete/:id",authAdmin,deleteMovie)


module.exports=movieRouter