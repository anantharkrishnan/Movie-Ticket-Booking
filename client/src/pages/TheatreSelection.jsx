import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import DateList from "../components/DateList";

const TheatreSelection = () => {
  const { id } = useParams(); 
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTodayIso = () => new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(
    location.state?.date || getTodayIso()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axiosInstance.get(`/movie/moviebyid/${id}`);
        setMovie(movieRes.data.data);

        const showRes = await axiosInstance.get(`/show/movie/${id}`);
        setShows(showRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-white p-6 text-center">Loading...</p>;
  if (!movie) return <p className="text-white p-6 text-center">No movie found</p>;

  // Generate next 7 dates
  const dateList = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  // Group shows by theatre & screen for selectedDate
  const groupedMap = {};
  shows.forEach(show => {
    // ✅ Use local date string to avoid UTC shift
    const showDateObj = new Date(show.date);
    const showDate = showDateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

    if (showDate !== selectedDate) return;

    const key = `${show.theatre._id}-${show.screen}`;
    if (!groupedMap[key]) {
      groupedMap[key] = {
        theatre: show.theatre,
        screen: show.screen,
        date: showDate,
        times: [],
        showIds: []
      };
    }
    groupedMap[key].times.push(show.time);
    groupedMap[key].showIds.push(show._id);
  });

  const groupedShows = Object.values(groupedMap);

  return (
    <div className="p-4 md:p-6 lg:p-10 text-white">
      <DateList
        dates={dateList}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mt-6 p-4 md:p-6 bg-[#101c44] rounded-xl">
        <img
          src={movie.posterUrl}
          className="h-52 w-40 sm:h-56 sm:w-44 md:h-60 md:w-48 rounded-xl object-cover mx-auto md:mx-0"
          alt={movie.title}
        />
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">
            {movie.language} • {movie.genre} • {movie.duration} min
          </p>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl mt-8 mb-3 text-center md:text-left">Available Theatres</h2>

      {groupedShows.length === 0 ? (
        <p className="text-center text-lg">No shows available on selected date</p>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          {groupedShows.map((group, idx) => (
            <div key={idx} className="bg-[#0d1736] p-4 md:p-6 rounded-xl">
              <h3 className="text-xl sm:text-2xl font-semibold">{group.theatre.name}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{group.theatre.location}</p>
              <h4 className="text-lg sm:text-xl mt-1">{group.screen}</h4>

              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {group.times.map((time, i) => (
                  <Link key={i} to={`/seat/${group.showIds[i]}`}>
                    <button className="border px-3 py-1 sm:px-4 sm:py-2 rounded bg-white text-black font-semibold text-sm sm:text-base">
                      {time}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatreSelection;






















