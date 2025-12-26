import Seat from "./Seat";
import { axiosInstance } from "../axiosInstance";

const SeatLayout = ({
  showId,
  lockedSeats = [],
  bookedSeats = [],
  selectedSeats,
  setSelectedSeats,
  refreshSeatStatus,
  seatLayout = [],
}) => {

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    if (lockedSeats.includes(seatId)) return "locked";
    return "available";
  };

  const handleSeatClick = async (seatId) => {
    const status = getSeatStatus(seatId);

    if (status === "booked") {
      alert("Seat already booked");
      return;
    }

    if (status === "locked" && !selectedSeats.includes(seatId)) {
      alert("Seat locked by another user");
      return;
    }

    try {
      
      if (status === "selected") {
        await axiosInstance.post("/seat/unlock", { showId, seatId });
        setSelectedSeats(prev => prev.filter(s => s !== seatId));
        refreshSeatStatus();
        return;
      }

      
      await axiosInstance.post("/seat/lock", { showId, seatId });
      setSelectedSeats(prev => [...prev, seatId]);
      refreshSeatStatus();

    } catch (err) {
      console.error("Seat error:", err);
      alert(err.response?.data?.message || "Seat action failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-10 px-2">

      <div className="flex gap-4 text-sm text-white mb-4 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border border-gray-400" /> Available
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-500" /> Locked
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500" /> Booked
        </div>
      </div>

     
      <div className="w-full flex flex-col items-center mb-12">
        <div className="w-4/5 max-w-[600px] h-3 bg-gray-300 rounded-[50%/100%]" />
        <p className="text-white font-semibold mt-1">SCREEN THIS WAY</p>
      </div>

      
      <div className="w-full flex flex-col items-center gap-3">
        {seatLayout.map(({ row, seats }) => (
          <div key={row} className="flex items-center gap-3 justify-center w-full flex-wrap md:flex-nowrap">
            
            <div className="w-16 text-right text-sm text-gray-400">
              {row} · ₹{seats[0]?.price}
            </div>

            
            <div className="flex gap-1 sm:gap-2 flex-nowrap overflow-x-auto">
              {seats.map(seat => {
                const seatId = `${row}${seat.number}`;
                return (
                  <Seat
                    key={seatId}
                    seatNumber={seatId}
                    status={getSeatStatus(seatId)}
                    price={seat.price}
                    onClick={() => handleSeatClick(seatId)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatLayout;
























