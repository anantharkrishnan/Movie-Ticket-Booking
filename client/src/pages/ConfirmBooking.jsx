import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY_STRIPE);


const CheckoutForm = ({ showId, selectedSeats, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      const paymentIntentId = result.paymentIntent?.id;
      if (!paymentIntentId) {
        alert("Payment not completed. Please try again.");
        return;
      }

     
      const res = await axiosInstance.post("/booking/confirm", {
        showId,
        seats: selectedSeats,
        totalPrice: totalAmount,
        paymentIntentId,
      });

      onSuccess(res.data.booking); 
    } catch (err) {
      console.error("Booking confirmation failed:", err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 text-white">
      <PaymentElement />
      <button
        type="submit"
        className="w-full bg-green-500 mt-4 py-2 rounded font-semibold"
      >
        Pay ₹{totalAmount}
      </button>
    </form>
  );
};


const ConfirmBookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" />;

  const { showId, selectedSeats } = state;

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [booking, setBooking] = useState(null);

  
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axiosInstance.get(`/show/showbyid/${showId}`);
        setShow(res.data.data);
      } catch (err) {
        console.error("Failed to load show", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  if (loading) {
    return <p className="text-white text-center p-6">Loading booking...</p>;
  }

  if (!show) {
    return <p className="text-red-500 text-center">Show not found</p>;
  }

  
  const totalAmount = selectedSeats.reduce((sum, seatId) => {
    const rowChar = seatId.charAt(0);
    const seatNumber = Number(seatId.slice(1));
    const rowObj = show.seatLayout.find((r) => r.row === rowChar);
    const seatObj = rowObj?.seats.find((s) => s.number === seatNumber);
    return sum + (seatObj?.price || 0);
  }, 0);

  
  const handleBookingSuccess = (confirmedBooking) => {
    setBooking(confirmedBooking);
  };

  
  if (booking) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white bg-gray-900 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center">Booking Confirmed!</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={show.movie.posterUrl}
            alt={show.movie.title}
            className="w-full md:w-48 h-72 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-semibold">{show.movie.title}</h3>
            <p className="text-sm text-gray-300">{show.movie.language}</p>
            <p className="text-sm text-gray-300">{show.movie.genre}</p>
            <p className="text-sm text-gray-300">{show.movie.duration}</p>
            <p className="text-sm font-semibold">{show.theatre.name}</p>
            <p className="text-sm">
              Seats: <b>{booking.seats.join(", ")}</b>
            </p>
            <p className="text-green-400 font-semibold">₹{booking.totalPrice}</p>
            <p className="text-xs text-gray-400">Status: {booking.bookingStatus}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/my-bookings")}
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold text-lg"
        >
          Go to My Bookings
        </button>
      </div>
    );
  }

 
  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        showId={showId}
        selectedSeats={selectedSeats}
        totalAmount={totalAmount}
        onSuccess={handleBookingSuccess}
      />
    </Elements>
  ) : (
    <div className="text-white text-center mt-10">
      <p>Loading payment...</p>
      <button
        onClick={async () => {
          try {
            const res = await axiosInstance.post("/payment/create-payment-intent", {
              amount: totalAmount,
            });
            setClientSecret(res.data.clientSecret);
          } catch (err) {
            console.error("Failed to create payment intent:", err);
          }
        }}
        className="mt-4 bg-green-500 py-2 px-4 rounded"
      >
        Retry Payment
      </button>
    </div>
  );
};

export default ConfirmBookingPage;








