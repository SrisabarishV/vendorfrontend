import React, { useState, useEffect } from "react";
import api, { getUserFromToken } from "../../api/axios"; 
import { Check, X, Clock, Play, CheckCircle, AlertCircle } from "lucide-react";

export default function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user && user.vendorId) {
      fetchBookings(user.vendorId);
    } else {
      console.error("No Vendor ID found in token:", user);
      setError("Vendor identification failed. Please log in again.");
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (vendorId) => {
    try {
      const response = await api.get("/Booking/vendorbookings", {
        params: { vendorId: vendorId }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vendor bookings:", err);
      setError("Failed to load booking requests.");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      // ---------------------------------------------------------
      // 🛠️ FINAL FIX BASED ON YOUR INPUT
      // ---------------------------------------------------------
      // 1. URL Parameter: bookingId (passed in 'params')
      // 2. JSON Body: { "status": "..." } (passed as 2nd argument)
      // ---------------------------------------------------------
      
      await api.put(
        '/Booking/bookingstatusupdate',       // URL
        { status: newStatus },                // BODY: { "status": "Accepted" }
        { params: { bookingId: bookingId } }  // QUERY: ?bookingId=7
      );

      // Optimistic UI Update
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.bookingId === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      
      let errorMessage = "Failed to update status.";
      
      if (err.response && err.response.data) {
        // Handle validation errors from .NET
        if (err.response.data.errors) {
           errorMessage += ` Validation: ${JSON.stringify(err.response.data.errors)}`;
        } else if (typeof err.response.data === 'string') {
           errorMessage += ` Server says: ${err.response.data}`;
        } else {
           errorMessage += ` Details: ${JSON.stringify(err.response.data)}`;
        }
      } else {
        errorMessage += ` ${err.message}`;
      }

      alert(errorMessage);
    }
  };

  // --- Helper Functions ---

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold w-fit"><Clock size={12} /> Pending</span>;
      case "Accepted":
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold w-fit"><Check size={12} /> Accepted</span>;
      case "InProgress":
        return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-bold w-fit"><Play size={12} /> In Progress</span>;
      case "Completed":
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold w-fit"><CheckCircle size={12} /> Completed</span>;
      case "Rejected":
      case "Cancelled":
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold w-fit"><X size={12} /> {status}</span>;
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  const renderActions = (booking) => {
    switch (booking.status) {
      case "Pending":
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleStatusUpdate(booking.bookingId, "Accepted")}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition"
            >
              <Check size={14} /> Accept
            </button>
            <button
              onClick={() => handleStatusUpdate(booking.bookingId, "Rejected")}
              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs transition"
            >
              <X size={14} /> Reject
            </button>
          </div>
        );
      case "Accepted":
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleStatusUpdate(booking.bookingId, "InProgress")}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs transition"
            >
              <Play size={14} /> Start Job
            </button>
          </div>
        );
      case "InProgress":
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleStatusUpdate(booking.bookingId, "Completed")}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition"
            >
              <CheckCircle size={14} /> Complete Job
            </button>
          </div>
        );
      default:
        return <span className="text-slate-400 text-xs italic">No actions available</span>;
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Loading requests...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-bold text-lg text-slate-800 mb-4">Incoming Booking Requests</h3>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
            <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
            <p>No booking requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Service</th>
                <th className="p-3">Scheduled</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking.bookingId} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-medium text-slate-900">
                    {booking.userName || booking.customerName || "Customer"} 
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{booking.serviceTitle}</div>
                    <div className="text-xs text-slate-400">{booking.categoryName}</div>
                  </td>
                  <td className="p-3">
                    <div className="whitespace-nowrap">{booking.scheduledDate}</div>
                    <div className="text-xs text-slate-400">{booking.scheduledTimeSlot}</div>
                  </td>
                  <td className="p-3 font-medium">
                    ${booking.price}
                  </td>
                  <td className="p-3">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="p-3 text-right">
                    {renderActions(booking)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}