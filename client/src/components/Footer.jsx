import React from 'react'
import { FaFacebook,FaInstagram,FaYoutube} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiMovie2AiLine } from "react-icons/ri";

const Footer = () => {
  return (
    <div className='   bg-linear-to-b from-blue-950 via-purple-950 to-pink-950 py-6 w-full text-center rounded shadow'>
        <footer className='flex flex-col items-center gap-3'>
          <div className='flex items-center gap-2'>
           <RiMovie2AiLine className='size-7 text-amber-500' />
            <h5  className=' text-2xl  font-bold font-logo bg-linear-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent'>MOVIEQUE</h5>
            </div>
             <div className='flex gap-4'>
             <FaFacebook className="text-blue-500 text-2xl cursor-pointer hover:text-blue-300 transition"  />
             <FaInstagram  className="text-pink-800 text-2xl cursor-pointer hover:text-pink-300 transition"  />
             <FaXTwitter  className=" text-2xl cursor-pointer hover:text-gray-600 transition" />
             <FaYoutube className="text-red-600 text-2xl cursor-pointer hover:text-red-300 transition"/>
             </div>
            </footer>
            </div>
  )
}

export default Footer