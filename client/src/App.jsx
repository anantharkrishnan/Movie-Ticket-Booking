import React from 'react'
import { Routes,Route,} from 'react-router-dom'
import Movies from "./pages/Movies"
import Theatres from "./pages/Theatres"
import Profile from './pages/Profile'
import Mybookings from "./pages/MyBookingsPage.jsx"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Footer from './components/Footer'
import MovieDetails from './pages/MovieDetails'
import TheatreSelection from './pages/TheatreSelection.jsx'
import ComingsoonDetails from './pages/comingsoonDetails'
import ComingsoonMovies from "./pages/ComingsoonMovies"
import AdminRoutes from './admin/routes/AdminRoutes'
import UserNavbar from './components/UserNavbar'
import AdminNavbar from './components/AdminNavbar'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from './axiosInstance';
import {persistor} from "./redux/store"
import { clearUser } from './redux/features/userslice'
import SeatSelectionPage from './pages/SeatSelectionPage'
import ConfirmBooking from './pages/ConfirmBooking'
import PaymentPage from './pages/PaymentPage'
import MyBookingsPage from './pages/MyBookingsPage.jsx'



const App = () => {
   
   const userData= useSelector((state)=>state.user)
        const dispatch=useDispatch()
        const navigate=useNavigate()
        
        const handleLogout=()=>{
            try {
              axiosInstance.get("user/logout").then((res)=>{
                persistor.purge()
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                dispatch(clearUser())
                navigate("/login");
              })
              
            } catch (error) {
              console.log(error);
              
              
            }
          }
  
  
 


  return (
    <div className='min-h-screen w-full bg-blue-950 flex flex-col '>
     {userData?.user?.role === "admin" ?(
  <AdminNavbar handleLogout={handleLogout} />
) : (
  <UserNavbar userData={userData} handleLogout={handleLogout} />
)}

          
    <div className='grow'>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/' element={<Movies/>}/>
         <Route path="/movie/:id" element={<MovieDetails />} />
           <Route path="/movie/:id/theaters" element={<TheatreSelection />} />
        <Route path='/login' element={<Login/>}/>
         <Route path='/theatres' element={<Theatres/>}/>
         <Route path='/profile' element={<Profile/>}/>
           <Route path='/mybookings' element={<Mybookings/>}/>
           <Route path='/ComingsoonMovies' element={<ComingsoonMovies/>}/>
           <Route path="/ComingsoonMovies/:id" element={<ComingsoonDetails />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
           <Route path="/seat/:showId" element={<SeatSelectionPage />} />
             <Route path="/confirm-booking" element={<ConfirmBooking />}/>
        <Route path="/payment" element={<PaymentPage />}/>
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        

      </Routes>
      
       
        
     </div>
     
    
    
   <Footer/>
    </div>
    
  )
}

export default App



