import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";

const AdminAddTheatre = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSeats: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/theatre/create", {
        name: form.name,
        location: form.location,
        totalSeats: Number(form.totalSeats),
      });

      alert("Theatre created successfully");
      navigate("/admin/theatres");
    } catch (err) {
      console.error(err);
      alert("Failed to create theatre");
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Add Theatre</h1>

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
          className="w-full p-2 bg-gray-800 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 px-5 py-2 rounded mt-4"
        >
          Create Theatre
        </button>

      </form>
    </div>
  );
};

export default AdminAddTheatre;

