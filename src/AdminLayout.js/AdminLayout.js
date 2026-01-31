import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-2xl font-bold mb-6 text-blue-800">Admin Panel</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
