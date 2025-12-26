import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import SeatLayout from "../components/SeatLayout";

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [lockedSeats, setLockedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [movie, setMovie] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  
  useEffect(() => {
    if (!userId) {
      alert("Please login to select seats");
      navigate("/login");
    }
  }, [userId, navigate]);


  const fetchShowDetails = async () => {
    try {
      const res = await axiosInstance.get(`/show/showbyid/${showId}`);
      const show = res.data.data;

      setMovie(show.movie);
      setTheatre(show.theatre);
      setSeatLayout(show.seatLayout || []);
    } catch (err) {
      console.error("Show fetch error", err);
    }
  };

  
  const fetchSeatStatus = async () => {
    try {
      const res = await axiosInstance.get(`/seat/status/${showId}`);
      setLockedSeats(res.data.lockedSeats || []);
      setBookedSeats(res.data.bookedSeats || []);
    } catch (err) {
      console.error("Seat status error", err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    let total = 0;

    selectedSeats.forEach(seatId => {
      const row = seatId.charAt(0);
      const seatNumber = Number(seatId.slice(1));

      const rowObj = seatLayout.find(r => r.row === row);
      const seatObj = rowObj?.seats.find(s => s.number === seatNumber);

      total += seatObj?.price || 0;
    });

    setTotalPrice(total);
  }, [selectedSeats, seatLayout]);

  useEffect(() => {
    fetchShowDetails();
    fetchSeatStatus();

    const interval = setInterval(fetchSeatStatus, 5000);
    return () => clearInterval(interval);
  }, [showId]);

  if (loading) {
    return <p className="text-white p-6">Loading seats...</p>;
  }

  
  const seatPriceMap = {};
  seatLayout.forEach(rowObj => {
    rowObj.seats.forEach(seat => {
      const seatId = `${rowObj.row}${seat.number}`;
      seatPriceMap[seatId] = seat.price;
    });
  });

  return (
    <div className="text-white">
      <SeatLayout
        showId={showId}
        lockedSeats={lockedSeats}
        bookedSeats={bookedSeats}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        refreshSeatStatus={fetchSeatStatus}
        seatLayout={seatLayout}
      />

      
      <div className="sticky bottom-0 bg-gray-900 p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Selected Seats</p>
          <p className="font-semibold">
            {selectedSeats.length ? selectedSeats.join(", ") : "None"}
          </p>
          <p className="text-sm text-green-400">
            🎟 {selectedSeats.length} Ticket · ₹{totalPrice}
          </p>
        </div>

        <button
          disabled={!selectedSeats.length}
          onClick={() =>
            navigate("/payment", {
              state: {
                showId,
                movie,
                theatre,
                selectedSeats,
                seatPriceMap,
                totalAmount: totalPrice, 
              },
            })
          }
          className={`px-6 py-2 rounded-lg font-semibold ${
            selectedSeats.length
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;











