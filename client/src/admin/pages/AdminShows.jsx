import { useEffect, useState } from "react";
import { axiosInstance } from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await axiosInstance.get("/show/allshows");
      setShows(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupShows = (shows) => {
    const map = {};
    shows.forEach((show) => {
      const key = `${show.movie?._id}-${show.theatre?._id}-${show.screen}`;
      if (!map[key]) {
        map[key] = { movie: show.movie, theatre: show.theatre, screen: show.screen, dates: {} };
      }
      const dateKey = new Date(show.date).toDateString();
      if (!map[key].dates[dateKey]) map[key].dates[dateKey] = [];
      map[key].dates[dateKey].push({ time: show.time, showId: show._id });
    });
    return Object.values(map);
  };

  const handleDelete = async (showId) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    try {
      await axiosInstance.delete(`/show/delete/${showId}`);
      alert("Show deleted successfully");
      fetchShows();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="text-white p-6 text-center">Loading shows...</div>;

  const groupedShows = groupShows(shows);

  return (
    <div className="p-4 md:p-6 lg:p-10 text-white">
      <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-6 text-center md:text-left">All Shows</h1>

      <div className="flex justify-center md:justify-start mb-6">
        <button
          onClick={() => navigate("/admin/shows/create")}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
        >
          Add Shows
        </button>
      </div>

      
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-lg">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Movie</th>
              <th className="p-3 text-left">Theatre</th>
              <th className="p-3 text-left">Screen</th>
              <th className="p-3 text-left">Schedule</th>
            </tr>
          </thead>
          <tbody>
            {groupedShows.map((group, idx) => (
              <tr key={idx} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-3 whitespace-nowrap">{group.movie?.title}</td>
                <td className="p-3 whitespace-nowrap">{group.theatre?.name} ({group.theatre?.location})</td>
                <td className="p-3 font-semibold whitespace-nowrap">{group.screen}</td>
                <td className="p-3">
                  <div className="flex gap-4 overflow-x-auto py-1 px-1">
                    {Object.entries(group.dates).map(([date, times]) => (
                      <div key={date} className="min-w-[120px] sm:min-w-[140px] text-center shrink-0">
                        <div className="text-sm font-semibold text-gray-300 mb-2">
                          {new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </div>
                        <div className="flex flex-col gap-2">
                          {times.map((t) => (
                            <div key={t.showId} className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
                              <button
                                onClick={() => navigate(`/admin/shows/edit/${t.showId}`)}
                                className="bg-white text-black px-2 sm:px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-500 hover:text-white transition flex-1"
                              >
                                {t.time}
                              </button>
                              <button
                                onClick={() => handleDelete(t.showId)}
                                className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-500 transition mt-1 sm:mt-0"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      <div className="md:hidden flex flex-col gap-4">
        {groupedShows.length === 0 && (
          <p className="text-center text-gray-400">No shows found</p>
        )}
        {groupedShows.map((group, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{group.movie?.title}</h3>
            <p className="text-gray-400">{group.theatre?.name} ({group.theatre?.location})</p>
            <p className="font-semibold">Screen: {group.screen}</p>
            <div className="flex flex-col gap-2 mt-2">
              {Object.entries(group.dates).map(([date, times]) => (
                <div key={date}>
                  <p className="text-gray-300 text-sm font-semibold mb-1">
                    {new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {times.map((t) => (
                      <div key={t.showId} className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => navigate(`/admin/shows/edit/${t.showId}`)}
                          className="bg-white text-black px-3 py-1 rounded font-semibold text-sm hover:bg-green-500 hover:text-white transition"
                        >
                          {t.time}
                        </button>
                        <button
                          onClick={() => handleDelete(t.showId)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShows;





