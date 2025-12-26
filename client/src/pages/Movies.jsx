import React from "react";
import Moviegrid from "../components/Moviegrid";
import Carousel from "../components/Carousel";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Movie = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16">
     
      <Carousel />

     
      <div>
        <h3 className="mt-10 font-extrabold text-3xl sm:text-4xl font-tagline bg-linear-to-r from-amber-700 to-yellow-400 bg-clip-text text-transparent text-center">
          Now Showing
        </h3>
        <Moviegrid />
      </div>

      
      <Link to="/ComingsoonMovies">
        <div className="mb-20 w-full max-w-[1300px] mx-auto p-5 bg-blue-900 rounded-2xl shadow-2xl hover:bg-blue-800 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-2xl sm:text-3xl text-white">
              Coming Soon
            </h3>
            <IoIosArrowForward className="text-white text-2xl sm:text-3xl" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Movie;


