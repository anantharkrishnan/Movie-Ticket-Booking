import { Routes, Route } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminMovies from "../pages/AdminMovies";
import AdminMovieDetails from "../pages/AdminMovieDetails";
import AdminCreateMovie from "../pages/AdminCreateMovie";
import AdminEditMovie from "../pages/AdminEditMovie";
import AdminTheatres from "../pages/AdminTheatres"
import AdminAddTheatre from "../pages/AdminAddTheatre";
import AdminAddShow from "../pages/AdminAddShow";
import AdminShows from "../pages/AdminShows";
import AdminEditShow from "../pages/AdminEditShow";
import AdminEditTheatre from "../pages/AdminEditTheatre";
import AdminComingsoon from "../pages/AdminComingsoon"
import AdminComingsoonDetails from "../pages/AdminCominsoonDetails";
import AdminCreateComingSoonMovie from "../pages/AdminComingsoonCreate";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
      
        <Route index element={<AdminDashboard />} />

       
        <Route path="movies" element={<AdminMovies />} />

        
        <Route path="moviedetails/:id" element={<AdminMovieDetails />} />
        <Route path="movies/create" element={<AdminCreateMovie />} />
        <Route path="movies/edit/:id" element={<AdminEditMovie />} />
        <Route path="theatres" element={<AdminTheatres />} />
       <Route path="theatres/create" element={<AdminAddTheatre />} />
       <Route path="shows/create" element={<AdminAddShow />} />
       <Route path="shows" element={<AdminShows />} />
       <Route path="shows/edit/:id" element={<AdminEditShow />} />
       <Route path="theatres/edit/:id"element={<AdminEditTheatre />} />
       <Route path="comingsoon" element={<AdminComingsoon />} />
      <Route path="comingsoon/details/:id" element={<AdminComingsoonDetails />} />
      <Route path="comingsoon/create" element={<AdminCreateComingSoonMovie />} />
      
      






      </Route>
    </Routes>
  );
};

export default AdminRoutes;



