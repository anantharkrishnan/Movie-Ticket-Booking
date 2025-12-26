import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";

const AdminEditTheatre = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSeats: "",
  });

  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchTheatre = async () => {
      try {
        const res = await axiosInstance.get(
          `/theatre/theatrebyid/${id}`
        );

        const theatre = res.data?.data;

        if (!theatre) {
          alert("Theatre not found");
          navigate("/admin/theatres");
          return;
        }

        setForm({
          name: theatre.name || "",
          location: theatre.location || "",
          totalSeats: theatre.totalSeats || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch theatre details");
        navigate("/admin/theatres");
      }
    };

    fetchTheatre();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(`/theatre/update/${id}`, {
        name: form.name.trim(),
        location: form.location.trim(),
        totalSeats: Number(form.totalSeats),
      });

      alert("Theatre updated successfully");
      navigate("/admin/theatres");
    } catch (err) {
      console.error(err);
      alert("Failed to update theatre");
    }
  };

  if (loading) {
    return (
      <p className="text-white p-6">
        Loading theatre...
      </p>
    );
  }

  return (
    <div className="p-6 text-white max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">
        Edit Theatre
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Theatre Name"
          required
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          name="totalSeats"
          type="number"
          value={form.totalSeats}
          onChange={handleChange}
          placeholder="Total Seats"
          required
          min={1}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 px-5 py-2 rounded"
          >
            Update Theatre
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/theatres")}
            className="bg-gray-600 px-5 py-2 rounded"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminEditTheatre;

