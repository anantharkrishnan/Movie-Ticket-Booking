import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../axiosInstance";

const AdminComingsoonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`comingsoon/moviebyid/${id}`)
      .then((res) => setMovie(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await axiosInstance.delete(`comingsoon/delete/${id}`);
      alert("Movie deleted");
      navigate("/admin/comingsoon");
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    }
  };

  if (loading)
    return (
      <div className="text-white text-xl text-center">Loading...</div>
    );

  if (!movie)
    return (
      <div className="text-white text-xl text-center">
        Movie not found
      </div>
    );

  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="text-white min-w-screen min-h-screen rounded ms-11">
     
      <div
        className="mt-7 h-[530px] w-[95%] bg-cover bg-center relative rounded-2xl overflow-hidden"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative flex gap-10 p-10">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-72 rounded-xl shadow-lg"
          />

          <div className="flex flex-col gap-5">
            <h1 className="text-5xl font-bold">{movie.title}</h1>

            <p className="text-gray-300">Duration: {movie.duration} min</p>
            <p className="text-gray-300">Genre: {movie.genre}</p>
            <p className="text-gray-300">
              Certification: {movie.certification}
            </p>
            <p className="text-gray-300">Release Date: {releaseDate}</p>

            <div>
              <span className="text-gray-300 me-1">Trailer:</span>
              <a
                href={movie.trailerUrl}
                className="text-blue-400 underline"
                target="_blank"
                rel="noreferrer"
              >
                Watch Trailer
              </a>
            </div>

            <p className="text-gray-300">Language: {movie.language}</p>
          </div>
        </div>
      </div>

     
      <div className="px-10 py-6 max-w-5xl">
        <h2 className="text-3xl font-semibold mb-3">About the movie</h2>
        <p className="text-gray-300 text-lg">{movie.description}</p>

       
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Cast</h2>
          <div className="flex gap-4 flex-wrap">
            {movie.cast.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full shadow-md mb-1"
                />
                <p className="font-semibold">{member.name}</p>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        
        <div className="mt-6 flex gap-4">
         

          <button
            onClick={handleDelete}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Delete Movie
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminComingsoonDetails;
