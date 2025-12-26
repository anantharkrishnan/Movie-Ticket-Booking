const Booking = require("../models/bookingModel");
const User= require("../models/userModel") 
const Show = require("../models/showModel"); 
const movie = require("../models/movieModel")
const redisClient = require("../config/redis");
const Theatre=require("../models/theatreModel")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const confirmBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { showId, seats, totalPrice, paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "paymentIntentId is required" });
    }

    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("PaymentIntent status:", paymentIntent.status);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    
    const existingBooking = await Booking.findOne({ paymentIntentId });
    if (existingBooking) {
      return res.status(200).json({
        success: true,
        booking: existingBooking,
        message: "Booking already confirmed",
      });
    }

    
    for (const seatId of seats) {
      const lockOwner = await redisClient.get(`lock:${showId}:${seatId}`);
      if (lockOwner !== userId) {
        return res.status(409).json({ message: `Seat ${seatId} lock expired` });
      }
    }

  
    const show = await Show.findById(showId).populate("movie theatre");
    if (!show) return res.status(404).json({ message: "Show not found" });
    if (!show.theatre) return res.status(500).json({ message: "Theatre information missing for this show" });

    
    const booking = await Booking.create({
      user: userId,
      movie: show.movie._id,
      Theatre: show.theatre._id, 
      show: showId,
      seats,
      totalPrice,
      paymentStatus: "paid",
      bookingStatus: "active",
      status: "PAID",
      paymentIntentId,
    });

    
    seats.forEach(seatId => {
      const rowChar = seatId.charAt(0);
      const seatNum = Number(seatId.slice(1));
      const row = show.seatLayout.find(r => r.row === rowChar);
      const seat = row?.seats.find(s => s.number === seatNum);
      if (seat) seat.status = "booked";
    });
    await show.save();

    
    for (const seatId of seats) {
      await redisClient.del(`lock:${showId}:${seatId}`);
      await redisClient.hDel(`show:${showId}:seats`, seatId);
    }

    return res.status(201).json({ success: true, booking });

  } catch (err) {
    console.error("Confirm booking error:", err);
    res.status(500).json({ message: "Booking confirmation failed" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("movie", "name poster")
      .populate("show")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("movie", "title posterUrl language genre duration")
      .populate("Theatre", "name location")
      .populate("show", "date time screen")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const { show: showId, seats, user: userId } = booking;

   
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    
    seats.forEach(seatId => {
      const rowChar = seatId.charAt(0);
      const seatNum = Number(seatId.slice(1));

      const row = show.seatLayout.find(r => r.row === rowChar);
      const seat = row?.seats.find(s => s.number === seatNum);

      if (seat) {
        seat.status = "available"; 
      }
    });

    await show.save();

 
    for (const seatId of seats) {
      await redisClient.del(`lock:${showId}:${seatId}`);
      await redisClient.hDel(`show:${showId}:seats`, seatId);
    }

    
    await Booking.findByIdAndDelete(req.params.id);

   
    await User.findByIdAndUpdate(userId, {
      $pull: { bookings: booking._id },
    });

    res.status(200).json({
      success: true,
      message: "Booking deleted & seats released successfully",
    });

  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  confirmBooking,
  getAllBookings,
 getMyBookings,
  deleteBooking,
};

