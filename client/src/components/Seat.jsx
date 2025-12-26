const Seat = ({ seatNumber, status, price, onClick }) => {
 
  const baseClasses =
    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center text-[10px] sm:text-xs transition";

  const statusClasses = {
    available: "border border-gray-500 hover:bg-gray-500 cursor-pointer",
    selected: "bg-green-500",
    locked: "bg-yellow-500 cursor-not-allowed",
    booked: "bg-red-500 cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={status === "locked" || status === "booked"}
      className={`${baseClasses} ${statusClasses[status]}`}
    >
      <span>{seatNumber}</span>
      <span className="text-yellow-300 text-[8px] sm:text-[10px]">₹{price}</span>
    </button>
  );
};

export default Seat;










