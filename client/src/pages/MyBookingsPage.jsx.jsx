import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/booking/my-bookings");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
  console.log("Attempting to delete booking ID:", bookingId); 

  if (!bookingId) {
    alert("Booking ID is missing!");
    return;
  }

  if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  try {
    const res = await axiosInstance.delete(`/booking/delete/${bookingId}`);
    console.log("Delete response:", res.data);


    setBookings((prev) => prev.filter((b) => b._id !== bookingId));

    alert(res.data.message || "Booking deleted successfully");
  } catch (err) {
    console.error("Cancel failed:", err);

    
    if (err.response) {
      console.error("Backend error data:", err.response.data);
      alert(err.response.data.message || "Failed to cancel booking");
    } else {
      alert(err.message || "Failed to cancel booking");
    }
  }
};


  if (loading) {
    return <p className="text-white text-center p-6">Loading bookings...</p>;
  }

  if (!bookings.length) {
    return <p className="text-white text-center p-6">No bookings yet</p>;
  }

  return (
    <div className="p-6 text-white max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">My Bookings</h2>

      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-gray-900 rounded-lg p-4 flex gap-4"
        >
          
          <img
            src={booking?.movie?.posterUrl || "/placeholder.png"}
            alt={booking?.movie?.title || "Movie"}
            className="w-28 h-40 object-cover rounded"
          />

        
          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-semibold">
              {booking?.movie?.title || "Unknown Movie"}
            </h3>

            <p className="text-sm text-gray-300">
              🎭 {booking?.Theatre?.name || "Unknown Theatre"} · Screen{" "}
              {booking?.show?.screen || "N/A"}
            </p>

            <p className="text-sm text-gray-300">
              📅 {booking?.show?.date || "N/A"} · ⏰{" "}
              {booking?.show?.time || "N/A"}
            </p>

            <p className="text-sm">
              Seats: <b>{booking?.seats?.join(", ") || "N/A"}</b>
            </p>

            <p className="text-green-400 font-semibold">
              ₹{booking?.totalPrice || 0}
            </p>

           
<p className="text-xs font-semibold text-green-400">
  Booking: {booking.status || "N/A"}
</p>


{booking.status !== "CANCELLED" && (
  <button
    onClick={() => handleCancelBooking(booking._id)}
    className="mt-2 px-4 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
  >
    Cancel Booking
  </button>
)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookingsPage;





