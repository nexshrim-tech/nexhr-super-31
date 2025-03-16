
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  MessageSquare,
  Users,
  Video,
  Briefcase,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSubscription } from '@/context/SubscriptionContext';

const SidebarNav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { setShowSubscriptionModal } = useSubscription();

  const menu = [
    { name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    { name: 'Add employee', icon: <Users className="w-5 h-5" />, path: '/add-employee' },
    { name: 'All Employee', icon: <Users className="w-5 h-5" />, path: '/all-employees' },
    { name: 'Attendance', icon: <Calendar className="w-5 h-5" />, path: '/attendance' },
    { name: 'Task & reminders', icon: <FileText className="w-5 h-5" />, path: '/tasks-reminders' },
    { name: 'Expenses', icon: <DollarSign className="w-5 h-5" />, path: '/expenses' },
    { name: 'Leave management', icon: <Calendar className="w-5 h-5" />, path: '/leave-management' },
    { name: 'Salary', icon: <DollarSign className="w-5 h-5" />, path: '/salary' },
    { name: 'Track', icon: <Map className="w-5 h-5" />, path: '/track' },
    { name: 'Assets', icon: <BarChart2 className="w-5 h-5" />, path: '/assets' },
    { name: 'Department', icon: <Users className="w-5 h-5" />, path: '/department' },
    { name: 'Messenger', icon: <MessageSquare className="w-5 h-5" />, path: '/messenger' },
    { name: 'Meetings', icon: <Video className="w-5 h-5" />, path: '/meetings' },
    { name: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/project-management' },
    { name: 'Help desk', icon: <HelpCircle className="w-5 h-5" />, path: '/help-desk' },
    { name: 'Document Generator', icon: <FileText className="w-5 h-5" />, path: '/document-generator' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
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
              <nav className="space-y-1 px-2 overflow-y-auto max-h-[calc(100vh-160px)]">
                {menu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 rounded-md py-3 px-3 text-sm font-medium hover:bg-gray-100 ${
                      isActive(item.path) 
                        ? 'bg-nexhr-primary/10 text-nexhr-primary font-semibold' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className={isActive(item.path) ? 'text-nexhr-primary' : ''}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <Button
                  onClick={() => {
                    setShowSubscriptionModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 flex items-center justify-start space-x-3 rounded-md py-3 px-3 text-sm font-medium bg-gradient-to-r from-nexhr-primary to-purple-600 text-white hover:opacity-90"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Manage Subscription</span>
                </Button>
              </nav>
              <div className="absolute bottom-0 w-64 border-t p-4 bg-white">
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
    <div className={`${collapsed ? 'w-16' : 'w-56'} min-h-screen border-r bg-white transition-all duration-300 relative flex flex-col`}>
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
      
      <nav className="space-y-1 px-2 overflow-y-auto flex-grow hide-scrollbar">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} rounded-md py-3 px-3 text-sm font-medium hover:bg-gray-100 ${
              isActive(item.path) 
                ? 'bg-nexhr-primary/10 text-nexhr-primary font-semibold' 
                : 'text-gray-700'
            }`}
            title={collapsed ? item.name : ''}
          >
            <span className={isActive(item.path) ? 'text-nexhr-primary' : ''}>
              {item.icon}
            </span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
        
        {!collapsed && (
          <Button
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full mt-4 flex items-center justify-start space-x-3 rounded-md py-3 px-3 text-sm font-medium bg-gradient-to-r from-nexhr-primary to-purple-600 text-white hover:opacity-90 animate-pulse-slow"
          >
            <CreditCard className="w-5 h-5" />
            <span>Manage Subscription</span>
          </Button>
        )}
        
        {collapsed && (
          <Button
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full mt-4 flex items-center justify-center rounded-md py-3 px-3 text-sm font-medium bg-gradient-to-r from-nexhr-primary to-purple-600 text-white hover:opacity-90 animate-pulse-slow"
            title="Manage Subscription"
          >
            <CreditCard className="w-5 h-5" />
          </Button>
        )}
      </nav>
      
      <div className={`border-t p-4 bg-white ${collapsed ? 'w-16' : 'w-56'}`}>
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
