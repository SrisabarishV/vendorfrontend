import React from 'react';
import { Search, Calendar, ClipboardList, History, Truck } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Homepage = ({ onLogin }) => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <header className="relative bg-slate-900 text-white pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            New: Enterprise Vendor Tracking
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Simplify Your <span className="text-blue-400">Vendor Booking</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            A unified platform to browse, book, manage, and track professional services for your business. Fast, reliable, and fully transparent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/dashboard")} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition shadow-lg shadow-blue-900/50">
              Get Started Now
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg font-semibold transition">
              View Service Catalog
            </button>
          </div>
        </div>
      </header>

      {/* Process Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">Complete service management in 4 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <ProcessCard 
              icon={<Search size={28} className="text-blue-600" />}
              title="1. Browse Services"
              desc="Explore a curated list of verified vendors tailored to your needs."
            />
            <ProcessCard 
              icon={<Calendar size={28} className="text-blue-600" />}
              title="2. Book Instantly"
              desc="Select your time slot and requirements. Instant confirmation."
            />
            <ProcessCard 
              icon={<ClipboardList size={28} className="text-blue-600" />}
              title="3. Manage Orders"
              desc="Modify bookings, chat with vendors, and approve deliverables."
            />
            <ProcessCard 
              icon={<History size={28} className="text-blue-600" />}
              title="4. Track History"
              desc="Access past invoices, performance reports, and re-book easily."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Truck className="text-blue-500" /> VendorFlow
            </div>
            <p className="text-sm">Empowering businesses with seamless service logistics since 2024.</p>
          </div>
          <FooterLinks title="Product" links={['Features', 'Pricing', 'Enterprise', 'Case Studies']} />
          <FooterLinks title="Company" links={['About', 'Careers', 'Blog', 'Contact']} />
          <FooterLinks title="Legal" links={['Terms', 'Privacy', 'Cookie Policy', 'Licenses']} />
        </div>
        <div className="text-center pt-8 border-t border-slate-800 text-sm">
          &copy; 2024 VendorFlow Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

/* --- Internal Helper Components for Homepage --- */

const Navbar = () => {
    const navigate = useNavigate();
    
  return (
  <nav className="absolute top-0 left-0 w-full z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2 text-white font-bold text-xl">
        <Truck className="text-blue-400" /> VendorFlow
      </div>
      <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
        <a href="#" className="hover:text-white transition">Services</a>
        <a href="#" className="hover:text-white transition">Enterprise</a>
        <a href="#" className="hover:text-white transition">Pricing</a>
      </div>
      <button 
        onClick={() => navigate("/login")}
        className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-full font-medium transition"
      >
        Login
      </button>
    </div>
  </nav>

);
};

const ProcessCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition group">
    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const FooterLinks = ({ title, links }) => (
  <div>
    <h4 className="font-bold text-white mb-4">{title}</h4>
    <ul className="space-y-2 text-sm">
      {links.map((link, i) => (
        <li key={i}><a href="#" className="hover:text-blue-400 transition">{link}</a></li>
      ))}
    </ul>
  </div>
);

export default Homepage;