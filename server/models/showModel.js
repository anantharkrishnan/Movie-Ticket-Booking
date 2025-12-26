const mongoose = require("mongoose");


const seatSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "locked", "booked"],
    default: "available",
  },
});


const seatRowSchema = new mongoose.Schema({
  row: { type: String, required: true },
  seats: [seatSchema],
});


const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
    screen: { type: String, required: true },

    
    date: { type: String, required: true },
    time: { type: String, required: true },

    
    seatLayout: [seatRowSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("show", showSchema);



