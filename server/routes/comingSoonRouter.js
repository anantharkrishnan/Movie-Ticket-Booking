const express= require("express")
const comingSoonRouter= express.Router()
const movieUpload= require("../middlewares/multer")

const {createMovie,getAllMovies,getMovieById,updateMovie,deleteMovie} = require("../controllers/comingsoonController")
comingSoonRouter.post("/create",movieUpload, createMovie)
comingSoonRouter.get("/allmovies",getAllMovies)
comingSoonRouter.get("/moviebyid/:id",getMovieById)
comingSoonRouter.put("/update/:id",updateMovie)
comingSoonRouter.delete("/delete/:id",deleteMovie)


module.exports=comingSoonRouter