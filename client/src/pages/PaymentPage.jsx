import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";


const stripePromise = loadStripe("pk_test_51ShSAURY2XKWWEhvel1bPZWO9WBUiCR4k2hxcPRDse6mnFPwQ0XQSNe6x72e4NibUxgr5nYZkTT2d44eBfplt7Yc00lCubQO2S");


const CheckoutForm = ({ showId, selectedSeats, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/my-bookings",
        },
        redirect: "if_required",
      });

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }

      const paymentIntent = result.paymentIntent;

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        alert("Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      
      await axiosInstance.post("/booking/confirm", {
        showId,
        seats: selectedSeats,
        totalPrice: totalAmount,
        paymentIntentId: paymentIntent.id,
      });

     
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking confirmation failed:", err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 text-white">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-500 mt-4 py-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>
    </form>
  );
};


const PaymentPage = () => {
  const { state } = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  if (!state) return <Navigate to="/" />;

  const { showId, selectedSeats, totalAmount } = state;

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axiosInstance.post(
          "/payment/create-payment-intent",
          {
            amount: totalAmount, 
          }
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Failed to create payment intent:", err);
        alert("Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [totalAmount]);

  if (loading) {
    return <p className="text-white text-center mt-10">Initializing payment…</p>;
  }

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        showId={showId}
        selectedSeats={selectedSeats}
        totalAmount={totalAmount}
      />
    </Elements>
  ) : (
    <p className="text-white text-center mt-10">Payment failed to load</p>
  );
};

export default PaymentPage;



