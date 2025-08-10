// pages/admin-dashboard.tsx
"use client";
import React from "react";
import { useTheme } from "next-themes";

const AdminDashboard: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  return (
    <div
      className={`min-h-screen p-6 ${currentTheme === "dark" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Cards */}
        <div
          className={`p-4 rounded-lg shadow ${currentTheme === "dark" ? "bg-slate-800" : "bg-white"}`}
        >
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p>Manage user accounts, roles, and permissions.</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow ${currentTheme === "dark" ? "bg-slate-800" : "bg-white"}`}
        >
          <h2 className="text-xl font-semibold mb-2">Course Management</h2>
          <p>Create, update, and delete courses.</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow ${currentTheme === "dark" ? "bg-slate-800" : "bg-white"}`}
        >
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p>View and generate various reports.</p>
        </div>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default AdminDashboard;
