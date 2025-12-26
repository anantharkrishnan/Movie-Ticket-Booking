import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance";

const ComingsoonDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`comingsoon/movieById/${id}`)
      .then((res) => {
        setMovie(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading || !movie) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="text-white min-h-screen px-4 sm:px-6 lg:px-10">
     
      <div
        className="relative mt-6 rounded-2xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-10">
         
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-40 sm:w-52 md:w-64 lg:w-72 rounded-xl shadow-lg mx-auto md:mx-0"
          />

          
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-tagline">
              {movie.title}
            </h1>

            <p className="text-gray-300">Duration: {movie.duration} min</p>
            <p className="text-gray-300">Genre: {movie.genre}</p>
            <p className="text-gray-300">Certification: U/A</p>
            <p className="text-gray-300">Release Date: {releaseDate}</p>

            <div className="break-all">
              <span className="text-gray-300 me-1">Trailer:</span>
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 underline"
              >
                {movie.trailerUrl}
              </a>
            </div>

            <p className="text-gray-300">Language: {movie.language}</p>
          </div>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 font-tagline">
          About the movie
        </h2>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          {movie.description}
        </p>

       
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 font-tagline">Cast</h2>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {movie.cast.map((member) => (
              <div key={member._id} className="flex flex-col items-center w-24">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shadow-md mb-2"
                />
                <p className="font-semibold text-sm text-center">
                  {member.name}
                </p>
                <p className="text-gray-400 text-xs text-center">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingsoonDetails;
