import { useEffect, useState } from "react";
import { axiosInstance } from "../../axiosInstance";

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/movie/allMovies"),
      axiosInstance.get("/theatre/alltheatres"), 
    ])
      .then(([moviesRes, theatresRes]) => {
        setMovies(moviesRes.data.data || []);
        setTheatres(theatresRes.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

       
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Movies</h3>
          <p className="text-2xl font-bold">
            {loading ? "Loading..." : movies.length}
          </p>
        </div>

      
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Theatres</h3>
          <p className="text-2xl font-bold">
            {loading ? "Loading..." : theatres.length}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;


