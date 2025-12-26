const theatre= require("../models/theatreModel")
const movie= require("../models/movieModel")
const show=require("../models/showModel")

const createTheatre = async(req,res)=>{
    try{
        const {name,location,totalSeats,shows,seatLayout}=req.body
  
    const newTheatre= await theatre.create({
        name,location,totalSeats,shows,seatLayout
    })
    res.status(201).json({message:"theatre created successfully",data:newTheatre})
    }
 catch(error){
        console.log(error);
        res.status(error.status||400).json({error:error.message})
    }
}

const getAllTheatres = async(req,res)=>{
    try {
        const theatres = await theatre.find().populate({
        path: "shows",
        populate: {
          path: "movie",
          model: "movie"
        }
      }).sort({createAt:-1})
        res.status(200).json({count:theatres.length,data:theatres})

    } catch (error) {
        console.log(error);
        res.status(error.status||500).json({error:error.message}) 
    }
}
const getTheatreById= async(req,res)=>{
    try {
        const theatreId= await theatre.findById(req.params.id).populate({
        path: "shows",
        populate: {
          path: "movie",
          model: "movie"
        }
      });
        if(!theatre){
             return res.status(404).json({message:"theatre not found"})
        }
        res.status(200).json({data:theatreId})
    } catch (error) {
         console.log(error);
        res.status(error.status||500).json({error:error.message})
    }
}

const updateTheatre = async(req,res)=>{
    try {
        const theatreUpdate= await theatre.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
         if(!theatreUpdate){
             return res.status(404).json({message:"theatre not found"})
        }
        res.status(200).json({data:theatreUpdate})
    } catch (error) {
        console.log(error);
        res.status(error.status||400).json({error:error.message})
    }
}

const deleteTheatre = async(req,res)=>{
    try {
        const theatreDelete= await theatre.findByIdAndDelete(req.params.id)
        if(!theatre){
            return res.status(404).json({message:"theatre not found"})
        }
        res.status(200).json({message:"movie deleted successfully",data:theatreDelete})
    } catch (error) {
         console.log(error);
        res.status(error.status||500).json({error:error.message})
    }
}


module.exports={createTheatre,getAllTheatres,getTheatreById,updateTheatre,deleteTheatre}