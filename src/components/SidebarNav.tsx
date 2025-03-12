
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarNav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menu = [
    { name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, active: false, path: '/' },
    { name: 'Add employee', icon: <Users className="w-5 h-5" />, active: false, path: '/add-employee' },
    { name: 'All Employee', icon: <Users className="w-5 h-5" />, active: false, path: '/all-employees' },
    { name: 'Attendance', icon: <Calendar className="w-5 h-5" />, active: false, path: '/attendance' },
    { name: 'Task & reminders', icon: <FileText className="w-5 h-5" />, active: false, path: '/tasks' },
    { name: 'Expenses', icon: <DollarSign className="w-5 h-5" />, active: false, path: '/expenses' },
    { name: 'Leave management', icon: <Calendar className="w-5 h-5" />, active: false, path: '/leave-management' },
    { name: 'Salary', icon: <DollarSign className="w-5 h-5" />, active: false, path: '/salary' },
    { name: 'Track', icon: <Map className="w-5 h-5" />, active: true, path: '/track' },
    { name: 'Assets', icon: <BarChart2 className="w-5 h-5" />, active: false, path: '/assets' },
    { name: 'Department', icon: <Users className="w-5 h-5" />, active: false, path: '/department' },
    { name: 'Help desk', icon: <HelpCircle className="w-5 h-5" />, active: false, path: '/help-desk' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-3 left-3 z-50" 
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="w-64 h-full bg-white overflow-y-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-semibold px-2 py-4">
                    <span className="logo">NEX</span>
                    <span>HR</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
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
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 w-64 border-t p-4">
                <Link
                  to="/logout"
                  className="flex items-center space-x-3 rounded-md py-3 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-56'} min-h-screen border-r bg-white transition-all duration-300 relative`}>
      <div className="p-4 mb-2">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'} font-semibold px-2 py-4`}>
          {!collapsed ? (
            <>
              <span className="logo">NEX</span>
              <span>HR</span>
            </>
          ) : (
            <span className="logo text-center">N</span>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-10 bg-white border rounded-full shadow-sm hover:bg-gray-100 z-10"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <nav className="space-y-1 px-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} rounded-md py-3 px-3 text-sm font-medium hover:bg-gray-100 ${
              item.active ? 'bg-gray-100 text-nexhr-primary' : 'text-gray-700'
            }`}
            title={collapsed ? item.name : ''}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className={`absolute bottom-0 ${collapsed ? 'w-16' : 'w-56'} border-t p-4`}>
        <Link
          to="/logout"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} rounded-md py-3 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default SidebarNav;
