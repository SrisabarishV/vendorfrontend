import React from 'react';

const StatCard = ({ title, value, sub, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
    <div className={`w-10 h-10 ${color} rounded-lg opacity-20`}></div>
  </div>
);

export default function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Activity" value="12" sub="2 pending" color="bg-blue-500" />
        <StatCard title="Total Spent/Earned" value="$4,250" sub="+18% from last month" color="bg-emerald-500" />
        <StatCard title="Services" value="8" sub="Active now" color="bg-violet-500" />
      </div>
      <div className="p-10 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
        <p>Welcome to your VendorFlow Dashboard.</p>
      </div>
    </div>
  );
}