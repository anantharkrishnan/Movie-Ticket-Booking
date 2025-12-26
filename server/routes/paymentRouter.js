const express = require("express");
const { createPaymentIntent } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent", createPaymentIntent);

module.exports = paymentRouter
