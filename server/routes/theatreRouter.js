const express = require("express")

const theatreRouter = express.Router()

const{createTheatre,getAllTheatres,getTheatreById,updateTheatre,deleteTheatre}= require("../controllers/theatreController")

theatreRouter.post("/create",createTheatre)
theatreRouter.get("/alltheatres",getAllTheatres)
theatreRouter.get("/theatrebyid/:id",getTheatreById)
theatreRouter.put("/update/:id",updateTheatre)
theatreRouter.delete("/delete/:id",deleteTheatre)

module.exports= theatreRouter