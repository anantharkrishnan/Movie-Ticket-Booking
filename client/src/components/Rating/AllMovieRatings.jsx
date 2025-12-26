import { useEffect, useState } from "react";
import { axiosInstance } from "../../axiosInstance";

const AllMovieRatings = ({ movieId, refresh }) => {
  const [ratings, setRatings] = useState([]);


  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axiosInstance.get(`/rating/ratingsbymovie/${movieId}`);
        
        setRatings(res.data.data);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
      }
    };
    fetchRatings();
  }, [movieId, refresh]);

  if (!ratings.length) return <p className="mt-2 text-gray-400">No ratings yet.</p>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">All Ratings</h3>
      <ul className="space-y-2">
        {ratings.map(r => (
          <li key={r._id} className="flex justify-between bg-gray-800 p-2 rounded">
            <span>{r.user?.name || "Anonymous"}</span>
            <span className="text-yellow-400">⭐ {r.rating}/10</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllMovieRatings;

