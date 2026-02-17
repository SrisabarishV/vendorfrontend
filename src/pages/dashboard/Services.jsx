import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import api, { getUserFromToken } from "../../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);         // Add/Edit Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete Confirmation Modal
  
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // Store ID to delete

  const user = getUserFromToken(); 

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    basePrice: "",
    priceUnit: "PerHour"
  });

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (user?.vendorId) {
      fetchServices(user.vendorId);
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchServices = async (id) => {
    try {
      const response = await api.get(`/Serve/GetByVendorID?vendorId=${id}`);
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/Categories/GetAllCategory?onlyActive=true');
      setCategories(response.data);
    } catch (error) { console.error(error); }
  };

  // --- 1. CLICK DELETE BUTTON (Open Modal) ---
  const handleDeleteClick = (serviceId) => {
    setDeleteId(serviceId);
    setShowDeleteModal(true);
  };

  // --- 2. CONFIRM DELETE (Call API) ---
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setSubmitting(true);
      await api.delete(`/Serve/DeleteService?vendorId=${user.vendorId}&serviceId=${deleteId}`);
      
      // Remove from UI
      setServices(prev => prev.filter(s => (s.serviceId || s.id) !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete service", error);
      alert("Failed to delete service.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- OPEN EDIT MODAL ---
  const handleEdit = (service) => {
    setEditingId(service.serviceId || service.id);
    setFormData({
      categoryId: service.categoryId,
      title: service.serviceTitle || service.title,
      description: service.serviceDescription || service.description,
      basePrice: service.basePrice,
      priceUnit: service.priceUnit
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ categoryId: "", title: "", description: "", basePrice: "", priceUnit: "PerHour" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.vendorId) return;

    setSubmitting(true);
    const payload = {
      categoryId: Number(formData.categoryId),
      title: formData.title,
      description: formData.description,
      basePrice: Number(formData.basePrice),
      priceUnit: formData.priceUnit
    };

    try {
      if (editingId) {
        await api.put(`/Serve/UpdateService?vendorId=${user.vendorId}&serviceId=${editingId}`, payload);
      } else {
        await api.post(`/Serve/CreateService?vendorId=${user.vendorId}`, payload);
      }
      await fetchServices(user.vendorId);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save service", error);
      alert("Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">My Services</h2>
           <p className="text-slate-500 text-sm">Manage your services</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-slate-500">Loading services...</div>
        ) : services.length === 0 ? (
           <div className="p-12 text-center text-slate-400">
              <p>You haven't added any services yet.</p>
           </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-medium">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.serviceId || service.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{service.serviceTitle || service.title}</td>
                  <td className="p-4">{service.categoryName || "N/A"}</td>
                  <td className="p-4 font-bold text-slate-700">₹{service.basePrice}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Active</span></td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(service.serviceId || service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* (Form Inputs same as before) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Cleaning" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                   <option value="">Select Category</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <input name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                    <select name="priceUnit" value={formData.priceUnit} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                       <option value="PerHour">Per Hour</option>
                       <option value="PerJob">Per Job</option>
                       <option value="PerDay">Per Day</option>
                    </select>
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                 <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                 {submitting ? "Saving..." : (editingId ? "Update Service" : "Create Service")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Service?</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}