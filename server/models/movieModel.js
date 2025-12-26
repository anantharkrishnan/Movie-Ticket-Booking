const mongoose= require("mongoose")

const movieSchema=new mongoose.Schema({
 title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: [String], 
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  duration: {
    type: Number, 
    required: true
  },
   certification: {
    type: String,
    enum: ["U", "U/A", "A", "S"],
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  posterUrl: {
    type: String, 
    required: true
  },
  posterPublicId: {
  type: String,
},
  backdropUrl: {
    type: String,
  },
    
  backdropPublicId: {type:String,
  },


  trailerUrl: {
    type: String 
  },
  cast: [
    {
      name: String,
      role: String,
      image: String
    }
  ],

      
  

},{timestamps:true})

module.exports=mongoose.model("movie",movieSchema)