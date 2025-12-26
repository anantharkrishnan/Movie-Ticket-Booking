import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Comingsoon = () => {
  return (
    <div
      className="flex justify-between items-center cursor-pointer"
    >
      <h3 className="font-bold text-3xl text-white">
        Coming Soon
      </h3>

      <IoIosArrowForward className="size-10 text-white" />
    </div>
  );
};

export default Comingsoon;

