const express = require("express");
const seatrouter = express.Router();

const { lockSeat,getSeatStatus,unlockSeat,getSeatLockTTL} = require("../controllers/seatController");
const authUser= require("../middlewares/authUser")

seatrouter.post("/lock",authUser,lockSeat);
seatrouter.get("/status/:showId", getSeatStatus);
seatrouter.post("/unlock",authUser, unlockSeat);
seatrouter.get("/ttl/:showId/:seatId", getSeatLockTTL);



module.exports = seatrouter;


