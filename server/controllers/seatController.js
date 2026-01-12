// const redisClient = require("../config/redis"); // 🔴 Redis DISABLED
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

// Redis disabled fallback
const redisClient = null;

/* =========================
   LOCK SEAT (Redis disabled)
   ========================= */
const lockSeat = async (req, res) => {
  try {
    const { showId, seatId } = req.body;
    const userId = req.user.id;

    if (!showId || !seatId) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 🔴 Redis locking disabled
    // const lockKey = `lock:${showId}:${seatId}`;
    // const success = await redisClient.set(
    //   lockKey,
    //   userId,
    //   { NX: true, EX: 300 }
    // );

    // if (!success) {
    //   return res.status(409).json({ message: "Seat already locked" });
    // }

    // await redisClient.hSet(`show:${showId}:seats`, seatId, "locked");

    return res.status(200).json({
      success: true,
      message: "Seat locking skipped (Redis disabled)",
      seatId,
    });

  } catch (error) {
    console.error("Seat lock error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   GET SEAT STATUS
   ========================= */
const getSeatStatus = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const bookedSeats = [];

    show.seatLayout.forEach(row => {
      row.seats.forEach(seat => {
        if (seat.status === "booked") {
          bookedSeats.push(`${row.row}${seat.number}`);
        }
      });
    });

    // 🔴 Redis disabled → no locked seats
    res.json({
      bookedSeats,
      lockedSeats: [],
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seat status" });
  }
};

/* =========================
   UNLOCK SEAT (Redis disabled)
   ========================= */
const unlockSeat = async (req, res) => {
  try {
    const { showId, seatId } = req.body;
    const userId = req.user.id;

    if (!showId || !seatId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // 🔴 Redis unlock disabled
    // const lockKey = `lock:${showId}:${seatId}`;
    // const hashKey = `show:${showId}:seats`;
    // const lockOwner = await redisClient.get(lockKey);

    return res.json({
      success: true,
      message: `Seat ${seatId} unlock skipped (Redis disabled)`,
    });

  } catch (error) {
    console.error("Error unlocking seat:", error);
    res.status(500).json({
      message: "Failed to unlock seat",
      error: error.message,
    });
  }
};

/* =========================
   GET SEAT LOCK TTL
   ========================= */
const getSeatLockTTL = async (req, res) => {
  try {
    // 🔴 Redis disabled → no locks
    res.json({ locked: false, ttl: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  lockSeat,
  getSeatStatus,
  unlockSeat,
  getSeatLockTTL,
};


