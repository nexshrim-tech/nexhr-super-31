
import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Calendar,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  Users,
} from 'lucide-react';

const SidebarNav: React.FC = () => {
  const menu = [
    { name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, active: true, path: '/' },
    { name: 'Add employee', icon: <Users className="w-5 h-5" />, active: false, path: '/add-employee' },
    { name: 'All Employee', icon: <Users className="w-5 h-5" />, active: false, path: '/all-employees' },
    { name: 'Attendance', icon: <Calendar className="w-5 h-5" />, active: false, path: '/attendance' },
    { name: 'Task & reminders', icon: <FileText className="w-5 h-5" />, active: false, path: '/tasks' },
    { name: 'Expenses', icon: <DollarSign className="w-5 h-5" />, active: false, path: '/expenses' },
    { name: 'Leave management', icon: <Calendar className="w-5 h-5" />, active: false, path: '/leave-management' },
    { name: 'Salary', icon: <DollarSign className="w-5 h-5" />, active: false, path: '/salary' },
    { name: 'Track', icon: <Map className="w-5 h-5" />, active: false, path: '/track' },
    { name: 'Assets', icon: <BarChart2 className="w-5 h-5" />, active: false, path: '/assets' },
    { name: 'Department', icon: <Users className="w-5 h-5" />, active: false, path: '/department' },
    { name: 'Help desk', icon: <HelpCircle className="w-5 h-5" />, active: false, path: '/help-desk' },
  ];

  return (
    <div className="w-56 min-h-screen border-r bg-white">
      <div className="p-4 mb-2">
        <div className="flex items-center space-x-2 font-semibold px-2 py-4">
          <span className="logo">NEX</span>
          <span>HR</span>
        </div>
      </div>
      <nav className="space-y-1 px-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 rounded-md py-3 px-3 text-sm font-medium hover:bg-gray-100 ${
              item.active ? 'bg-gray-100 text-nexhr-primary' : 'text-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-56 border-t p-4">
        <Link
          to="/logout"
          className="flex items-center space-x-3 rounded-md py-3 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default SidebarNav;
