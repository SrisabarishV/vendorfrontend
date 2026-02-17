import React, { useState, useEffect, use } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // <-- 1. Import the decoder
import { 
  Menu, Bell, Truck, LayoutDashboard, Calendar, 
  ShieldCheck, History, Settings, LogOut, Users 
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If there's no token at all, kick them to login
    if (!token) {
        navigate("/login");
        return;
    }

    try {
        // 2. Decode the token
        const decodedToken = jwtDecode(token);
        
        // 3. Extract the role. 
        // Note: .NET often stores roles in a specific long URI key, 
        // but sometimes just in "role". We check for both to be safe.
        const extractedRole = 
            decodedToken.role || 
            decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
            "Customer"; // Default fallback

        setRole(extractedRole);

    } catch (error) {
        // If the token is invalid or expired, clear it and redirect
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Don't render the dashboard until the role is figured out to prevent UI flickering
  if (!role) return null; 

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed md:relative z-20 h-full shadow-xl md:shadow-none`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
          <Truck className="text-blue-600" size={28} />
          {sidebarOpen && <span className="ml-2 font-bold text-xl text-slate-800">VendorFlow</span>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {/* Overview (Both) */}
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="Overview" 
            to="/dashboard"
            active={isActive("/dashboard")}
            full={sidebarOpen} 
          />

          {/* User Specific Links */}
          {role === "Customer" && (
            <>
            <SidebarItem 
                icon={<Calendar />} 
                label="Book Services" 
                to="/dashboard/bookings"
                active={isActive("/dashboard/bookings")}
                full={sidebarOpen} 
            />
            <SidebarItem 
                icon={<History />} 
                label="My Bookings" 
                to="/dashboard/mybooking"
                active={isActive("/dashboard/mybooking")}
                full={sidebarOpen} 
            />
            </>
          )}

          {/* Vendor Specific Links */}
          {role === "Vendor" && (
            <>
                <SidebarItem 
                    icon={<ShieldCheck />} 
                    label="My Services" 
                    to="/dashboard/services"
                    active={isActive("/dashboard/services")}
                    full={sidebarOpen} 
                />
                <SidebarItem 
                    icon={<Users />} 
                    label="Client Requests" 
                    to="/dashboard/vendor-bookings"
                    active={isActive("/dashboard/vendor-bookings")}
                    full={sidebarOpen} 
                />
            </>
          )}

          {/* Common Links (Both) */}
          <SidebarItem 
            icon={<History />} 
            label="History" 
            to="/dashboard/history"
            active={isActive("/dashboard/history")}
            full={sidebarOpen} 
          />
          <SidebarItem 
            icon={<Settings />} 
            label="Settings" 
            to="/dashboard/settings"
            active={isActive("/dashboard/settings")}
            full={sidebarOpen} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center text-slate-500 hover:text-red-600 transition w-full p-2 rounded-lg hover:bg-red-50">
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3 font-medium">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
                {role === "Customer" ? "Customer Dashboard" : "Vendor Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {/* Fallback to 'U' if role isn't completely parsed yet */}
              {role ? role.charAt(0) : 'U'} 
              {/* {username && username.charAt(0).toUpperCase()} */}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, full, to }) => (
  <Link 
    to={to} 
    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <span className="shrink-0">{icon}</span>
    {full && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">{label}</span>}
  </Link>
);

export default Dashboard;