const mongoose=require("mongoose")

 ratingSchema=new mongoose.Schema({

     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
 

},{timestamps:true})

module.exports=mongoose.model("rating",ratingSchema)