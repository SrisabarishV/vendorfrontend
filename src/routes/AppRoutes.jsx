import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../auth/Login";
import Homepage from "../pages/Homepage";
import Register from "../auth/Register";
import Overview from "../pages/dashboard/Overview";
import Bookings from "../pages/dashboard/Bookings";
import Services from "../pages/dashboard/Services";
import VendorBookings from "../pages/dashboard/VendorBookings";
import History from "../pages/dashboard/History";
import CurrentBook from "../pages/dashboard/Currentbook";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} >
        <Route index element={<Overview />} />

        <Route path="bookings" element={<Bookings />} />
        <Route path="services" element={<Services />} />
        <Route path="mybooking" element={<CurrentBook />} />
        <Route path="vendor-bookings" element={<VendorBookings />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}
