import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";

const AdminAddShow = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [screen, setScreen] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState("");

  const [seatLayout, setSeatLayout] = useState([
    { row: "A", count: 20, price: 150 },
    { row: "B", count: 20, price: 150 },
    { row: "C", count: 20, price: 180 },
    { row: "D", count: 20, price: 200 },
  ]);

  // Fetch movies and theatres
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, theatreRes] = await Promise.all([
          axiosInstance.get("/movie/allmovies"),
          axiosInstance.get("/theatre/alltheatres"),
        ]);
        setMovies(movieRes.data.data);
        setTheatres(theatreRes.data.data);
      } catch (err) {
        console.error("Error fetching movies or theatres:", err);
      }
    };
    fetchData();
  }, []);

  const handleSeatChange = (index, field, value) => {
    const updatedLayout = [...seatLayout];
    updatedLayout[index][field] = Number(value);
    setSeatLayout(updatedLayout);
  };

  const handleAddRow = () => {
    const nextRowChar = String.fromCharCode(65 + seatLayout.length);
    setSeatLayout([...seatLayout, { row: nextRowChar, count: 0, price: 0 }]);
  };

  const handleRemoveRow = (index) => {
    const updatedLayout = seatLayout.filter((_, i) => i !== index);
    setSeatLayout(updatedLayout);
  };

  const handleAddShow = async () => {
    if (!selectedMovie || !selectedTheatre || !screen || !date || !time) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const builtLayout = seatLayout.map((row) => ({
        row: row.row,
        seats: Array.from({ length: row.count }, (_, i) => ({
          number: i + 1,
          price: row.price,
          status: "available",
        })),
      }));

      const payload = {
        movie: selectedMovie,
        theatre: selectedTheatre,
        screen,
        date, // ✅ send as YYYY-MM-DD string
        time,
        seatLayout: builtLayout,
      };

      await axiosInstance.post("/show/create", payload);
      alert("Show created successfully!");
      navigate("/admin/shows");
    } catch (err) {
      console.error("Add show error:", err);
      alert(err.response?.data?.message || "Failed to add show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Show</h1>

      <div className="mb-4">
        <label className="block mb-1">Movie</label>
        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">Select Movie</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Theatre</label>
        <select
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">Select Theatre</option>
          {theatres.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.location})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Screen</label>
        <input
          value={screen}
          onChange={(e) => setScreen(e.target.value)}
          placeholder="Enter Screen Name"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Seat Layout</h2>
        {seatLayout.map((row, index) => (
          <div key={row.row} className="flex gap-4 items-center mb-2">
            <span className="w-8">{row.row}</span>
            <input
              type="number"
              value={row.count}
              onChange={(e) => handleSeatChange(index, "count", e.target.value)}
              placeholder="Seats"
              className="w-20 p-1 rounded bg-gray-800 border border-gray-600"
            />
            <input
              type="number"
              value={row.price}
              onChange={(e) => handleSeatChange(index, "price", e.target.value)}
              placeholder="Price"
              className="w-20 p-1 rounded bg-gray-800 border border-gray-600"
            />
            <button
              onClick={() => handleRemoveRow(index)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={handleAddRow}
          className="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Add Row
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddShow}
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500"
        >
          {loading ? "Adding..." : "Add Show"}
        </button>
        <button
          onClick={() => navigate("/admin/shows")}
          className="bg-gray-600 px-6 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminAddShow;














