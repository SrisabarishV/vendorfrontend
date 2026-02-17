import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Store, ArrowRight, Loader2 } from "lucide-react";
import api from "../api/axios"; 

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    role: "User",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    password: "",
    vendorName: "",
    businessName: "",
    description: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // --- Step 1: Registration ---
      let endpoint = "";
      let payload = {};

      const commonFields = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        password: formData.password,
      };

      if (formData.role === "Customer") {
        endpoint = "/User/CreateUser";
        payload = { ...commonFields };
      } else {
        endpoint = "/Vendor/CreateVendor";
        payload = {
          ...commonFields,
          vendorName: formData.vendorName,
          businessName: formData.businessName,
          description: formData.description,
          contactNumber: formData.contactNumber,
        };
      }

      // Call Register API
      await api.post(endpoint, payload);

      // --- Step 2: Auto-Login (New Logic) ---
      // We log the user in immediately so they have a token for the Dashboard
      try {
        const loginResponse = await api.post("/Auth/login", {
          email: formData.email,
          password: formData.password
        });

        // Extract and save token
        const token = loginResponse.data.token || loginResponse.data;
        if (token) {
          localStorage.setItem("token", token);
          // Optional: Save role if provided
          if (loginResponse.data.role) {
             localStorage.setItem("userRole", loginResponse.data.role);
          }
        }
      } catch (loginError) {
        console.warn("Registration successful, but auto-login failed.", loginError);
        // Even if auto-login fails, we proceed (or you could redirect to login)
      }

      // --- Step 3: Redirect to Dashboard ---
      navigate("/dashboard");

    } catch (err) {
      console.error("Registration Error:", err);
      if (err.response && err.response.data) {
          setError(err.response.data.message || err.response.data || "Registration failed.");
      } else {
          setError("Registration failed. Please check your connection and details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-sm">Join our platform to manage your services</p>
        </div>

        <div className="p-8">
          {/* Role Selection Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "Customer" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                formData.role === "Customer"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User size={18} /> User
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "Vendor" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                formData.role === "Vendor"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Store size={18} /> Vendor
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section: Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                    label="First Name" 
                    name="firstName" 
                    placeholder="John" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                />
                <InputField 
                    label="Last Name" 
                    name="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                />
                <InputField 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                <InputField 
                    label="Phone Number" 
                    name="phoneNumber" 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                />
              </div>
            </div>

            {/* Section: Vendor Specific Info (Conditional) */}
            {formData.role === "Vendor" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 border-b border-blue-100 pb-2 mt-2">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="Vendor Name" 
                    name="vendorName" 
                    placeholder="Display Name" 
                    value={formData.vendorName}
                    onChange={handleChange}
                  />
                  <InputField 
                    label="Business Name" 
                    name="businessName" 
                    placeholder="Legal Business Name" 
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  <InputField 
                    label="Contact Number" 
                    name="contactNumber" 
                    type="tel" 
                    placeholder="Business Line" 
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                  <div className="md:col-span-2">
                      <label className="text-sm font-medium text-slate-700 mb-1 block">
                         Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                         name="description"
                         required
                         value={formData.description}
                         onChange={handleChange}
                         className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                         placeholder="Describe your services..."
                      ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Section: Address */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Address
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <InputField 
                    label="Address Line 1" 
                    name="address1" 
                    placeholder="123 Main St" 
                    value={formData.address1}
                    onChange={handleChange}
                />
                <InputField 
                    label="Address Line 2" 
                    name="address2" 
                    required={false} 
                    placeholder="Apt 4B " 
                    value={formData.address2}
                    onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField label="City" name="city" placeholder="New York" value={formData.city} onChange={handleChange} />
                <InputField label="State" name="state" placeholder="NY" value={formData.state} onChange={handleChange} />
                <InputField label="Country" name="country" placeholder="USA" value={formData.country} onChange={handleChange} />
                <InputField label="Pincode" name="pincode" placeholder="10001" value={formData.pincode} onChange={handleChange} />
              </div>
            </div>

            {/* Section: Security */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Security
              </h3>
              <div>
                <InputField 
                    label="Password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters long.</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition-all ${
                   formData.role === "Vendor" 
                   ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" 
                   : "bg-slate-900 hover:bg-slate-800 shadow-slate-300"
                } shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Creating Account...
                  </>
                ) : (
                  <>
                    Register as {formData.role} <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-900 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MOVED OUTSIDE THE REGISTER COMPONENT
// ==========================================
const InputField = ({ label, name, type = "text", required = true, placeholder, className = "", value, onChange }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}         
      onChange={onChange}   
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  </div>
);