import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import LanguageSelector from "../components/LanguageSelector";
import SearchBar from "../components/SearchBar";

const ComingsoonMovies = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Kannada",
    "Telugu",
    "Malayalam",
  ];

  const filteredMovies = movies
    .filter((m) => !selectedLanguage || m.language === selectedLanguage)
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("comingsoon/allMovies")
      .then((res) => {
        setMovies(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-white py-10">Loading movies...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto">
      
      <div className="mb-8 p-4 rounded-2xl bg-black/40">
        <h3 className="text-white font-bold text-lg mb-3">Languages</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <LanguageSelector
            languages={languages}
            selectedLanguage={selectedLanguage}
            onselect={setSelectedLanguage}
          />
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </div>

    
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 justify-items-center">
  {filteredMovies.map((movie) => (
    <Link to={`/ComingsoonMovies/${movie._id}`} key={movie._id}>
      <div className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[250px] xl:max-w-[280px]
                      text-white hover:scale-105 transition-transform">

        {/* Poster */}
        <div className="w-full overflow-hidden rounded-xl bg-gray-900"
             style={{ aspectRatio: "2 / 3" }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="mt-3 space-y-1 text-center">
          <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">
            {movie.genre}
          </p>
        </div>
      </div>
    </Link>
  ))}

  {filteredMovies.length === 0 && (
    <p className="col-span-full text-center text-gray-400">
      No movies found
    </p>
  )}
</div>
    </div>
  );
};

export default ComingsoonMovies;
