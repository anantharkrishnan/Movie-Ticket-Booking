import React from "react";

export default function DateList({ selectedDate, onSelect }) {
  const getNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Use local date string (YYYY-MM-DD) instead of ISO to avoid UTC shift
      const isoLocal = date.toLocaleDateString("en-CA");

      return {
        full: date,
        iso: isoLocal,
        dayNum: date.getDate(),
        dayName: date.toLocaleString("en-US", { weekday: "short" }),
        month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      };
    });
  };

  const dates = getNext7Days();

  const isDateSelected = (date) => selectedDate === date.iso;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
      <div className="text-gray-500 font-semibold rotate-90 tracking-widest shrink-0">
        {dates[0].month}
      </div>

      <div className="flex gap-3 sm:gap-4">
        {dates.map((d, index) => {
          const selected = isDateSelected(d);

          return (
            <div
              key={index}
              onClick={() => onSelect(d.iso)}
              className="flex flex-col items-center cursor-pointer transition-all shrink-0"
            >
              <div
                className={`flex flex-col items-center justify-center 
                  w-12 sm:w-14 h-16 sm:h-20 rounded-2xl font-bold 
                  ${selected ? "bg-black text-white" : "bg-gray-100 text-black"}`}
              >
                <span className="text-lg sm:text-xl">{d.dayNum}</span>
                <span className="text-xs sm:text-sm -mt-1">{d.dayName}</span>
              </div>

              {!selected && (
                <span className="text-gray-500 text-xs sm:text-sm mt-1">{d.dayName}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


