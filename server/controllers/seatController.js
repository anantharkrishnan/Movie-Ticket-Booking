const redisClient = require("../config/redis");
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");


const lockSeat = async (req, res) => {
  try {
    const { showId, seatId } = req.body;
    const userId = req.user.id; 


    if (!showId || !seatId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const lockKey = `lock:${showId}:${seatId}`;

    const success = await redisClient.set(
      lockKey,
      userId,
      { NX: true, EX: 300 } 
    );
    


    if (!success) {
      return res.status(409).json({ message: "Seat already locked" });
    }

    await redisClient.hSet(`show:${showId}:seats`, seatId, "locked");

  
    const verify = await redisClient.get(lockKey);
    const ttl = await redisClient.ttl(lockKey);
   



    res.status(200).json({
      success: true,
      message: "Seat locked successfully",
      seatId,
    });

  } catch (error) {
    console.error("Seat lock error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const Show = require("../models/showModel");

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

  
    const hashKey = `show:${showId}:seats`;
    const lockedSeatsMap = await redisClient.hGetAll(hashKey);

    const validLockedSeats = [];
    for (const seatId of Object.keys(lockedSeatsMap || {})) {
      const ttl = await redisClient.ttl(`lock:${showId}:${seatId}`);
      if (ttl > 0) validLockedSeats.push(seatId);
      else await redisClient.hDel(hashKey, seatId);
    }

    res.json({
      bookedSeats,
      lockedSeats: validLockedSeats,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seat status" });
  }
};



const unlockSeat = async (req, res) => {
  try {
    const { showId, seatId } = req.body;
    const userId = req.user.id; 

    if (!showId || !seatId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const lockKey = `lock:${showId}:${seatId}`;
    const hashKey = `show:${showId}:seats`;

    const lockOwner = await redisClient.get(lockKey);

    console.log(
      `UNLOCK CHECK → seat=${seatId}, lockOwner=${lockOwner}, userId=${userId}`
    );

    if (!lockOwner) {
      return res.status(404).json({ message: "Seat is not locked" });
    }

    if (lockOwner !== userId) {
      return res.status(403).json({
        message: "Not allowed: you are not the owner of this lock",
      });
    }

    await redisClient.del(lockKey);
    await redisClient.hDel(hashKey, seatId);

    res.json({
      success: true,
      message: `Seat ${seatId} unlocked successfully`,
    });

  } catch (error) {
    console.error("Error unlocking seat:", error);
    res.status(500).json({
      message: "Failed to unlock seat",
      error: error.message,
    });
  }
};



const getSeatLockTTL = async (req, res) => {
  try {
    const { showId, seatId } = req.params;

    const lockKey = `lock:${showId}:${seatId}`;
    const ttl = await redisClient.ttl(lockKey);
    console.log("TTL:", ttl)

    if (ttl <= 0) {
      return res.json({ locked: false, ttl: 0 });
    }

    res.json({ locked: true, ttl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { lockSeat, getSeatStatus, unlockSeat, getSeatLockTTL };
