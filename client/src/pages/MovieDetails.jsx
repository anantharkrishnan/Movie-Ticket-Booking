import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance";

import UserMovieRating from "../components/Rating/UserMovieRating";
import RateMovie from "../components/Rating/RateMovie";
import AllMovieRatings from "../components/Rating/AllMovieRatings";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  const [userRating, setUserRating] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(loggedUser);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axiosInstance.get(`movie/movieById/${id}`);
        setMovie(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!movie) return;

    const fetchRatings = async () => {
      try {
        const res = await axiosInstance.get(
          `/rating/ratingsbymovie/${movie._id}`
        );

        setAverage(res.data.average || 0);
        setCount(res.data.count || 0);

        if (loggedUser) {
          const myRating = res.data.data.find(
            (r) => r.user._id === loggedUser._id
          );
          setUserRating(myRating || null);
        }
      } catch (err) {
        console.error("Failed to fetch ratings", err);
      }
    };

    fetchRatings();
  }, [movie, refresh, loggedUser]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserRating(null);
    }
  }, [isLoggedIn]);

  if (loading || !movie) return <div className="text-white text-center mt-10">Loading...</div>;

  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="text-white min-h-screen px-4 md:px-8 lg:px-16">
     
      <div
        className="mt-7 w-full bg-cover bg-center relative rounded-2xl overflow-hidden"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 p-5 md:p-10">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full sm:w-64 md:w-72 rounded-xl shadow-lg mx-auto md:mx-0"
          />

          <div className="flex flex-col gap-4 md:gap-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center md:text-left">{movie.title}</h1>

          
            <div className="flex items-center gap-2 text-lg sm:text-xl justify-center md:justify-start">
              <FaStar className="text-yellow-400" />
              <span className="font-bold">{average > 0 ? average : "N/A"}</span>
              <span className="text-sm text-gray-400">({count})</span>
            </div>

            <p className="text-gray-300">Duration: {movie.duration} min</p>
            <p className="text-gray-300">Genre: {movie.genre}</p>
            <p className="text-gray-300">Certification: U/A</p>
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

            <Link to={`/movie/${id}/theaters`}>
              <button className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold w-fit mt-2 md:mt-0 mx-auto md:mx-0">
                Book Tickets
              </button>
            </Link>
          </div>
        </div>
      </div>

      
      <div className="px-2 sm:px-4 md:px-10 py-6 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">About the movie</h2>
        <p className="text-gray-300 text-base sm:text-lg">{movie.description}</p>

        
        <div className="mt-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Cast</h2>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {movie.cast.map((member) => (
              <div key={member._id} className="flex flex-col items-center w-24 sm:w-28">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md mb-1"
                />
                <p className="font-semibold text-center">{member.name}</p>
                <p className="text-gray-400 text-sm text-center">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        
        <div className="mt-8">
          {isLoggedIn ? (
            <>
              <UserMovieRating userRating={userRating} />
              <RateMovie
                movieId={movie._id}
                userRating={userRating}
                setUserRating={setUserRating}
                onSuccess={() => setRefresh((prev) => !prev)}
              />
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center md:text-left">
              Login to rate this movie
            </p>
          )}

          <AllMovieRatings movieId={movie._id} refresh={refresh} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;










