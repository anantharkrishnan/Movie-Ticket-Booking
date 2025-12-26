const stripe = require("../config/stripe");

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, 
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent };

