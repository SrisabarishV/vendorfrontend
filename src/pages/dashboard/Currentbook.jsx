import React, { useState, useEffect } from "react";
import api, { getUserFromToken } from '../../api/axios'; // Adjust path if necessary
import { Trash2, Pencil, Save, X } from "lucide-react"; // Import icons

const CurrentBook = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal & Edit States
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    if (user && user.role === "Customer") {
      setIsCustomer(true);
      fetchBookings();
    } else {
      setIsCustomer(false);
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/Booking/mybookings");
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
      setLoading(false);
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (bookingId, e) => {
    if (e) e.stopPropagation(); // Prevent opening the modal if clicked on card

    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      // Assuming the API expects bookingId as a query parameter
      await api.delete(`/Booking/Deletebooking?bookingId=${bookingId}`);
      
      // Remove from UI immediately
      setBookings(bookings.filter((b) => b.bookingId !== bookingId));
      if (selectedBooking?.bookingId === bookingId) {
        closeDetails();
      }
      alert("Booking deleted successfully.");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking.");
    }
  };

  // --- EDIT HANDLERS ---
  const handleEditClick = () => {
    setEditFormData({
        bookingId: selectedBooking.bookingId,
        bookingAddress: selectedBooking.bookingAddress,
        scheduledDate: selectedBooking.scheduledDate,
        scheduledTimeSlot: selectedBooking.scheduledTimeSlot,
        userNotes: selectedBooking.userNotes || ""
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put("/Booking/UpdatebookingDetails", editFormData);
      
      // Update local state to reflect changes
      const updatedBookings = bookings.map((b) => 
        b.bookingId === editFormData.bookingId ? { ...b, ...editFormData } : b
      );
      setBookings(updatedBookings);
      setSelectedBooking({ ...selectedBooking, ...editFormData });
      
      setIsEditing(false);
      alert("Booking updated successfully!");
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking. Please check your inputs.");
    }
  };

  // --- MODAL CONTROLS ---
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(false); // Reset edit mode when opening
  };

  const closeDetails = () => {
    setSelectedBooking(null);
    setIsEditing(false);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Pending": return "bg-orange-500";
      case "Confirmed": return "bg-green-500";
      case "Completed": return "bg-blue-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (!isCustomer) {
    return (
      <div className="p-5 text-center text-red-500">
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p>Only Customers can view this page.</p>
      </div>
    );
  }

  if (loading) return <div className="p-5">Loading bookings...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className="p-5 font-sans">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No active bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((booking) => (
            <div 
              key={booking.bookingId} 
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg text-gray-800">{booking.serviceTitle}</span>
                <span className={`px-2 py-1 rounded-full text-white text-xs font-bold ${getStatusColorClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              
            

              <div className="mb-4 text-gray-600 text-sm space-y-1">
                <p><strong className="text-gray-800">Vendor:</strong> {booking.vendorName}</p>
                <p><strong className="text-gray-800">Date:</strong> {booking.scheduledDate}</p>
                <p><strong className="text-gray-800">Time:</strong> {booking.scheduledTimeSlot}</p>
                <p><strong className="text-gray-800">Price:</strong> ${booking.price} / {booking.priceUnit}</p>
              </div>

              <button
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors"
                onClick={() => handleViewDetails(booking)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- POPUP MODAL --- */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {isEditing ? "Edit Booking" : `Booking Details #${selectedBooking.bookingId}`}
              </h3>
              <button onClick={closeDetails} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 space-y-3">
              {/* Static Info (Not Editable) */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                 <div>
                    <span className="block text-gray-500 text-xs">Category</span>
                    <span className="font-medium">{selectedBooking.categoryName}</span>
                 </div>
                 <div>
                    <span className="block text-gray-500 text-xs">Service</span>
                    <span className="font-medium">{selectedBooking.serviceTitle}</span>
                 </div>
                 <div>
                    <span className="block text-gray-500 text-xs">Vendor</span>
                    <span className="font-medium">{selectedBooking.vendorName}</span>
                 </div>
                 <div>
                    <span className="block text-gray-500 text-xs">Price</span>
                    <span className="font-medium">${selectedBooking.price} ({selectedBooking.priceUnit})</span>
                 </div>
              </div>

              <hr className="border-gray-100" />

              {/* Editable Fields */}
              {isEditing ? (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                        <input 
                            type="date" 
                            name="scheduledDate"
                            value={editFormData.scheduledDate} 
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Time Slot</label>
                        <input 
                            type="text" 
                            name="scheduledTimeSlot"
                            value={editFormData.scheduledTimeSlot} 
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                        <input 
                            type="text" 
                            name="bookingAddress"
                            value={editFormData.bookingAddress} 
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                        <textarea 
                            name="userNotes"
                            value={editFormData.userNotes} 
                            onChange={handleEditChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <strong className="text-gray-700">Scheduled Date:</strong> 
                        <span className="text-gray-600">{selectedBooking.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-700">Time Slot:</strong> 
                        <span className="text-gray-600">{selectedBooking.scheduledTimeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-700">Address:</strong> 
                        <span className="text-gray-600 text-right max-w-[60%]">{selectedBooking.bookingAddress || "N/A"}</span>
                    </div>
                    {selectedBooking.userNotes && (
                        <div className="mt-4">
                        <strong className="text-sm text-gray-700">My Notes:</strong>
                        <p className="bg-gray-50 p-2 rounded text-sm text-gray-600 mt-1 border border-gray-100">
                            {selectedBooking.userNotes}
                        </p>
                        </div>
                    )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between items-center">
              
              {isEditing ? (
                  <>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveEdit} 
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                  </>
              ) : (
                  <>
                    <button 
                        onClick={() => handleDelete(selectedBooking.bookingId)}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded flex items-center gap-2 font-medium"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleEditClick} 
                            className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded flex items-center gap-2 font-medium"
                        >
                            <Pencil size={16} /> Edit
                        </button>
                        <button 
                            onClick={closeDetails} 
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-medium"
                        >
                            Close
                        </button>
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentBook;