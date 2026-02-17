import React from 'react';
import { MapPin, User, Tag } from 'lucide-react'; // Assuming you use an icon library

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Header Section */}
      <div className="p-5 grow">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Tag size={12} />
            {service.categoryName}
          </span>
          <span className="text-lg font-bold text-gray-900">
             ₹{service.basePrice} <span className="text-sm text-gray-500 font-normal">/ {service.priceUnit}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-1">{service.serviceTitle}</h3>
        
        {/* Vendor/Business Name */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <User size={14} className="mr-1" />
          <span className="font-medium">{service.businessName}</span> 
          <span className="mx-1">•</span> 
          <span>{service.vendorName}</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {service.serviceDescription}
        </p>
        
        {/* Location */}
        <div className="flex items-center text-gray-500 text-xs mt-auto">
          <MapPin size={14} className="mr-1 text-red-500" />
          {service.location}, {service.vendorCity} - {service.vendorPincode}
        </div>
      </div>

      {/* Footer / Action Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button 
          onClick={() => onBook(service.serviceId)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;