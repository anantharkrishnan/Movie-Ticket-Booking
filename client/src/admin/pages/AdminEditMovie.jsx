import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";

const AdminEditShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [screen, setScreen] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axiosInstance.get(`/show/showbyid/${id}`);
        const show = res.data.data;

        setScreen(show.screen || "");
        setDate(show.date?.slice(0, 10) || "");
        setTime(show.time || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load show");
        navigate("/admin/shows");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id, navigate]);

  
  const handleUpdate = async () => {
    if (!screen || !date || !time) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.put(`/show/update/${id}`, {
        screen,
        date: new Date(date), 
        time,
      });

      alert("Show updated successfully");
      navigate("/admin/shows");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 text-white max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Show</h1>

      
      <div className="mb-4">
        <label className="block mb-1">Screen</label>
        <input
          value={screen}
          onChange={e => setScreen(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      
      <div className="mb-4">
        <label className="block mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      
      <div className="mb-6">
        <label className="block mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      
      <div className="flex gap-4">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500"
        >
          {loading ? "Updating..." : "Update Show"}
        </button>

        <button
          onClick={() => navigate("/admin/shows")}
          className="bg-gray-600 px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminEditShow;


