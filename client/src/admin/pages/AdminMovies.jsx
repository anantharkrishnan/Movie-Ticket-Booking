import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { axiosInstance } from "../../axiosInstance";

const AdminMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axiosInstance
      .get("movie/allMovies")
      .then((res) => {
        setMovies(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

 
  const handleDelete = async (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await axiosInstance.delete(`movie/delete/${movieId}`);
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      alert("Failed to delete movie");
    }
  };

  if (loading)
    return (
      <div className="text-white text-xl text-center p-6">Loading movies...</div>
    );

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Admin Movies
        </h1>
        <button
          onClick={() => navigate("/admin/movies/create")}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
        >
          Add Movie
        </button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">
            No movies found
          </p>
        )}

        {movies.map((movie) => (
          <div
            key={movie._id}
            className="relative flex flex-col items-center bg-gray-900 rounded-lg shadow-lg overflow-hidden"
          >
            
            <div
              className="w-full aspect-2/3 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/admin/moviedetails/${movie._id}`)}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            
            <div className="bg-black w-full flex items-center justify-center gap-2 py-1">
              <FaStar className="text-amber-500" />
              <span className="font-semibold">{movie.averageRating || "N/A"}</span>
              <span className="text-sm text-gray-400">
                ({movie.ratingCount || 0})
              </span>
            </div>

            
            <button
              onClick={() => handleDelete(movie._id)}
              className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMovies;












 
