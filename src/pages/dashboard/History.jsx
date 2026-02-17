import React from 'react';

export default function History() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-bold text-lg text-slate-800 mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition">
              <td className="p-3">#ORD-001</td>
              <td className="p-3 font-medium text-slate-800">Office Cleaning</td>
              <td className="p-3">Oct 24, 2024</td>
              <td className="p-3"><span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">Completed</span></td>
              <td className="p-3 font-medium">$450</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}