import React, { useState } from 'react'
import { RiMovie2AiLine } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserNavbar = ({ handleLogout }) => {
    const userData = useSelector((state) => state.user)
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            <nav className='w-full p-4 bg-linear-to-t from-blue-950 via-purple-950 to-pink-950 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6'>
                
                
                <div className='flex flex-col md:flex-row items-center md:gap-4 text-center md:text-left'>
                    <div className="flex items-center gap-3">
                        <RiMovie2AiLine className='text-amber-500 text-3xl md:text-4xl' />
                        <h3 className='text-2xl md:text-3xl font-bold font-logo bg-linear-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent'>
                            MOVIEQUE
                        </h3>
                    </div>
                    <p className="text-sm md:text-lg font-logo font-bold bg-linear-to-r from-gray-400 to-white bg-clip-text text-transparent mt-1 md:mt-0">
                        Beyond the Screen
                    </p>
                </div>

               
                <div className="md:hidden">
                    <button
                        className="text-white text-2xl"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ☰
                    </button>
                </div>

           
                <div className={`flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto ${isOpen ? 'flex' : 'hidden'} md:flex`}>
                    <Link className='text-lg md:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent' to={"/"}>Movies</Link>
                    <Link className='text-lg md:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent' to={"/theatres"}>Theatres</Link>
                    <Link className='text-lg md:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent' to={"/mybookings"}>MyBookings</Link>
                    <Link className='text-lg md:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent' to={"/profile"}>Profile</Link>

                    {
                        userData.user && Object.keys(userData.user).length > 0 ? (
                            <div className='flex flex-col md:flex-row items-center gap-2 md:gap-3'>
                                <button
                                    className="text-lg md:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 text-white px-2 rounded"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                                <span className='text-white text-lg md:text-xl'>{userData.user.name}</span>
                            </div>
                        ) : (
                            <Link
                                className="text-lg md:text-xl font-medium bg-linear-to-r from-amber-600 to-yellow-500 text-white px-2 rounded"
                                to={"/Login"}
                            >
                                Login
                            </Link>
                        )
                    }
                </div>
            </nav>
        </div>
    )
}

export default UserNavbar
