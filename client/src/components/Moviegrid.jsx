import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { axiosInstance } from "../axiosInstance";
import LanguageSelector from "./LanguageSelector";
import SearchBar from "./SearchBar";

const MovieGrid = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [search, setSearch] = useState("");   
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const languages = ['English', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'Malayalam'];
  const filteredMovies = movies
    .filter(m => !selectedLanguage || m.language === selectedLanguage)
    .filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("movie/allMovies")
      .then((res) => {
        setMovies(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-xl mt-10 text-white">Loading movies...</div>;
  }

  return (
    <div className="px-4 py-6">
      
      <div className="mb-10 p-3 rounded-3xl bg-gray-900">
        <h3 className="mb-2 text-white font-bold text-lg sm:text-xl">Languages</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
          <LanguageSelector 
            languages={languages} 
            selectedLanguage={selectedLanguage} 
            onselect={setSelectedLanguage} 
          />
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <Link to={`/movie/${movie._id}`} key={movie._id} className="mx-auto">
            <div className="text-white overflow-hidden hover:scale-[1.03] transition-transform duration-300">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full sm:w-52 md:w-60 h-64 sm:h-72 md:h-80 object-cover rounded-t-lg"
              />
              <div className="bg-black flex items-center gap-1.5 rounded-b-lg h-8 px-2">
                <FaStar className="text-amber-500" />
                <span className="font-semibold">
                  {movie.averageRating > 0 ? movie.averageRating : "N/A"}
                </span>
                <span className="text-sm text-gray-400">({movie.ratingCount})</span>
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-lg sm:text-xl font-semibold bg-linear-to-r bg-white to-gray-200 bg-clip-text text-transparent">
                  {movie.title}
                </h3>
                <p className="text-gray-300">{movie.genre}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;





