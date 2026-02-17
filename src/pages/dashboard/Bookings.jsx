import React, { useState, useEffect } from 'react';
import ServiceCard from '../Servicecard';
import { Filter, X, Search, Calendar, Clock, FileText, Loader2 } from 'lucide-react';
import api from '../../api/axios'; // Ensure this points to your configured axios instance

const BookingDashboard = () => {
  // Service Data State
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // --- BOOKING STATE ---
  const [selectedService, setSelectedService] = useState(null); // Stores the service being booked
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    scheduledDate: '',
    scheduledTimeSlot: '',
    userNotes: ''
  });

  // 1. Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/Categories/GetAllCategory?onlyActive=true');
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // 2. Fetch Services
  const fetchServices = async (isFilter = false) => {
    setLoading(true);
    try {
      let url = '/Serve/GetAllservices';

      if (isFilter) {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (city) params.append('city', city);
        if (pincode) params.append('pincode', pincode);
        
        if (selectedCategory || city || pincode) {
            url = `/Serve/services/Filterbooking?${params.toString()}`;
        }
      }

      const response = await api.get(url);
      setServices(response.data || []);
    } catch (error) {
      console.error("Failed to fetch services", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  // --- HANDLERS ---

  const handleApplyFilter = () => fetchServices(true);

  const handleResetFilter = () => {
    setSelectedCategory('');
    setCity('');
    setPincode('');
    fetchServices(false); // Reload all
  };

  // 1. Open Modal
  const handleBookClick = (service) => {
    setSelectedService(service);
    // Reset form
    setBookingForm({
      scheduledDate: '',
      scheduledTimeSlot: '09:00 AM - 10:00 AM', // Default or empty
      userNotes: ''
    });
  };

  // 2. Handle Input Change
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  // 3. Submit Booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    setBookingLoading(true);

    const payload = {
      serviceId: selectedService.serviceId || selectedService.id,
      scheduledDate: bookingForm.scheduledDate,
      scheduledTimeSlot: bookingForm.scheduledTimeSlot,
      userNotes: bookingForm.userNotes
    };

    try {
      // POST https://localhost:7000/api/Booking/bookings
      await api.post('/Booking/bookings', payload);
      
      alert("Booking confirmed successfully!");
      setSelectedService(null); // Close modal
    } catch (error) {
      console.error("Booking failed", error);
      alert("Failed to book service. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Available Services</h1>
      </div>

      {/* --- Filter Section --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" placeholder="e.g. Coimbatore" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input type="text" placeholder="e.g. 641001" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <button onClick={handleApplyFilter} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto">
              <Search size={18} /> Filter
            </button>
            <button onClick={handleResetFilter} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto">
              <X size={18} /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* --- Service Grid --- */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard 
                key={service.serviceId} 
                service={service} 
                // Pass the specific service object to the handler
                onBook={() => handleBookClick(service)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
              <button onClick={handleResetFilter} className="mt-2 text-blue-600 hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      )}

      {/* --- BOOKING MODAL --- */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-blue-50 p-5 border-b border-blue-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Booking</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{selectedService.serviceTitle}</p>
              </div>
              <button 
                onClick={() => setSelectedService(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Service Summary */}
            <div className="p-5 bg-white border-b border-gray-100">
                {/* Business Name */}
                {selectedService.businessName && (
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Business:</span>
                      <span className="font-semibold text-gray-800">{selectedService.businessName}</span>
                  </div>
                )}

                {/* Vendor Name (Added as requested) */}
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Vendor Name:</span>
                    <span className="font-semibold text-gray-800">{selectedService.vendorName}</span>
                </div>

                {/* Price */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-bold text-emerald-600">₹{selectedService.basePrice} / {selectedService.priceUnit}</span>
                </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              
              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Calendar size={16} /> Scheduled Date
                </label>
                <input 
                  type="date"
                  name="scheduledDate"
                  required
                  value={bookingForm.scheduledDate}
                  onChange={handleBookingChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Clock size={16} /> Preferred Time
                </label>
                <select 
                  name="scheduledTimeSlot"
                  required
                  value={bookingForm.scheduledTimeSlot}
                  onChange={handleBookingChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
                  <FileText size={16} /> Notes (Optional)
                </label>
                <textarea 
                  name="userNotes"
                  rows="3"
                  placeholder="Any specific instructions? e.g. Door code is 1234"
                  value={bookingForm.userNotes}
                  onChange={handleBookingChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? <Loader2 className="animate-spin" size={18} /> : "Confirm Booking"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingDashboard;