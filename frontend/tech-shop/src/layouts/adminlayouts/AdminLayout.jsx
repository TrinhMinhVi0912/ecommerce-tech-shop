import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
