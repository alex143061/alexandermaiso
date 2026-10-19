import React from "react";
import { StarsCanvas } from "../components/canvas";

const Dashboard = () => {
  return (
    <div className="relative w-full min-h-screen bg-primary text-white p-4 sm:p-8">
      <h1>My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-teal-400">User Management</h3>
          <p className="text-sm text-gray-400 mt-1">Manage users and their roles</p>
          <button className="mt-3 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-sm font-medium transition-colors">
            Manage Users
          </button>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-purple-400">Leads</h3>
          <p className="text-sm text-gray-400 mt-1">View and manage leads</p>
          <button className="mt-3 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-sm font-medium transition-colors">
            View Leads
          </button>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-orange-400">CRM</h3>
          <p className="text-sm text-gray-400 mt-1">Customer relationship management</p>
          <button className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-sm font-medium transition-colors">
            Open CRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
