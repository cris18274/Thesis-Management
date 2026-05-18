import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md';

  return (
    <div className="flex flex-col w-64 h-screen bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase text-lg">Thesis Admin</span>
      </div>
      <div className="flex-1 px-2 py-4 space-y-1">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/students" className={linkClass}>
          Students
        </NavLink>
        <NavLink to="/professors" className={linkClass}>
          Professors
        </NavLink>
        <NavLink to="/theses" className={linkClass}>
          Theses
        </NavLink>
        <NavLink to="/defenses" className={linkClass}>
          Defenses
        </NavLink>
        <NavLink to="/reports" className={linkClass}>
          Reports
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
