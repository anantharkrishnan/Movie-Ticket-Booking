const Rating= require("../models/ratingModel")
const user= require("../models/userModel")
const mongoose = require("mongoose")

const createRating= async(req,res)=>{
    try {
const{movie,rating}=req.body
const user= req.user.id

let existing= await Rating.findOne({user,movie})
if(existing) return res.status(400).json({message:"Rating Exists"})

        const newRating= await Rating.create({user,movie,rating})
        res.status(201).json({message:"review added",data:newRating})
    } catch (error) {
        console.log(error);
        
          res.status(500).json({ message: error.message });
  }
    }
  

const getRatingsByMovie = async (req, res) => {
  try {
    
    
    const { movieId } = req.params;
   


  const ratings = await Rating.find({
      movie: movieId
    }).populate("user", "name email");

const count = ratings.length;
    const average =
      count === 0
        ? 0
        : Number(
            (
              ratings.reduce((sum, r) => sum + r.rating, 0) / count
            ).toFixed(1)
          );

    res.status(200).json({
      success: true,
      count,
      average,
      data: ratings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


      const updateRating = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const rating = await Rating.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found or unauthorized" });
    }

    
    rating.rating = req.body.rating;

    await rating.save();

    res.status(200).json({
      message: "Rating updated successfully",
      data: rating
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

  const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (rating.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await rating.deleteOne();

    res.json({ success: true, message: "Rating deleted" });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
};



    module.exports={createRating,getRatingsByMovie,updateRating,deleteRating}