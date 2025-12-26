import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";

const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTheatres = async () => {
    try {
      const res = await axiosInstance.get("/theatre/alltheatres");
      setTheatres(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theatre?")) return;

    try {
      await axiosInstance.delete(`/theatre/delete/${id}`);
      setTheatres(theatres.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete theatre");
    }
  };

  if (loading) return <p className="text-white text-center p-6">Loading theatres...</p>;

  return (
    <div className="p-4 md:p-6 lg:p-10 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Theatres</h1>
        <button
          onClick={() => navigate("/admin/theatres/create")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          + Add Theatre
        </button>
      </div>

     
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-gray-900 rounded">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Total Seats</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map((theatre) => (
              <tr key={theatre._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                <td className="p-3">{theatre.name}</td>
                <td className="p-3">{theatre.location}</td>
                <td className="p-3">{theatre.totalSeats}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/theatres/edit/${theatre._id}`)}
                    className="bg-yellow-500 px-3 py-1 rounded text-black hover:bg-yellow-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(theatre._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {theatres.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No theatres found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <div className="md:hidden flex flex-col gap-4">
        {theatres.length === 0 && (
          <p className="text-center text-gray-400">No theatres found</p>
        )}
        {theatres.map((theatre) => (
          <div key={theatre._id} className="bg-gray-800 p-4 rounded-lg flex flex-col gap-2">
            <h2 className="font-semibold text-lg">{theatre.name}</h2>
            <p className="text-gray-300">Location: {theatre.location}</p>
            <p className="text-gray-300">Total Seats: {theatre.totalSeats}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => navigate(`/admin/theatres/edit/${theatre._id}`)}
                className="bg-yellow-500 px-3 py-1 rounded text-black hover:bg-yellow-400 transition flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(theatre._id)}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTheatres;

