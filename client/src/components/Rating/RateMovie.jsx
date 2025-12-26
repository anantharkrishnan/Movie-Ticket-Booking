import { useState } from "react";
import { axiosInstance } from "../../axiosInstance";
import { toast } from "react-toastify";

const RateMovie = ({ movieId, userRating, setUserRating, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const handleRating = async (value) => {
    setLoading(true);
    try {
      if (userRating) {
        await axiosInstance.put(`/rating/updaterating/${userRating._id}`, { rating: value });
        toast.success("Rating updated ");
        setUserRating({ ...userRating, rating: value });
      } else {
        const res = await axiosInstance.post("/rating/create", { movie: movieId, rating: value });
        toast.success("Rating added ");
        setUserRating(res.data.data);
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rate");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userRating) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/rating/deleterating/${userRating._id}`);
      toast.success("Rating deleted");
      setUserRating(null);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-sm font-medium text-gray-300">Rate this movie</h4>

      <div className="flex gap-1 items-center">
        {[1,2,3,4,5,6,7,8,9,10].map(num => (
          <button
            key={num}
            onClick={() => handleRating(num)}
            disabled={loading}
            className={`text-xl ${num <= (userRating?.rating || 0) ? "text-yellow-400" : "text-gray-500"}`}
          >
            ★
          </button>
        ))}

        
        {userRating?.user?._id === loggedUser?._id && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="ml-4 text-sm text-red-400 hover:text-red-600"
          >
            Delete rating
          </button>
        )}
      </div>
    </div>
  );
};

export default RateMovie;




