const mongoose = require('mongoose')


const theatreSchema = new mongoose.Schema({

     name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String, 
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
   shows: [ { type: mongoose.Schema.Types.ObjectId, ref: "show" }],
 
  seatLayout: [
    {   
      seatNumber: { type: String, required: true },
      type: { type: String, enum: ["regular", "premium", "vip"], default: "regular" },
      isAvailable: { type: Boolean, default: true }
    }
  ],

},{timestamps:true})

module.exports=mongoose.model("Theatre",theatreSchema)