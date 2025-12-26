const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "show",
      required: true,
    },
    movie:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    Theatre:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
    seats: {
      type: [String], 
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "CANCELLED"],
      default: "PAID",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);


