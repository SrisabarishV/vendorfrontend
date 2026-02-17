import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "https://localhost:7000/api",
});

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    
    // 🔍 DEBUGGING: Print the entire token to the console
    console.log("🔑 Decoded Token:", decoded); 

    return {
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub || decoded.id,
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || "User",
      email: decoded.email || decoded.sub,
      
      // Check all possible casing variations
      vendorId: decoded.VendorId || decoded.vendorId || decoded["VendorId"] || null
    };
  } catch (error) {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;