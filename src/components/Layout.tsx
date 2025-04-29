import React, { ReactNode, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileSearch, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: 'dashboard' | 'new' | 'search';
  onNavigate: (view: 'dashboard' | 'new' | 'search') => void;
}

export const Layout = memo(function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-[#0E0F12]">
      {/* Sidebar */}
      <motion.div 
        className="bg-[#1A1C20] border-r border-[#2C2F36] h-full flex flex-col shadow-lg hw-accelerated"
        initial={{ width: collapsed ? 80 : 250 }}
        animate={{ width: collapsed ? 80 : 250 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-[#2C2F36] flex justify-between items-center">
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-lg text-[#EAEAEA]"
            >
              ServiceDesk
            </motion.h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="rounded-full p-2 hover:bg-[#2A2E38] transition-colors"
          >
            {collapsed ? 
              <ChevronRight className="h-5 w-5 text-[#9CA3AF]" /> : 
              <ChevronLeft className="h-5 w-5 text-[#9CA3AF]" />
            }
          </button>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 scroll-container smooth-scroll py-6 px-3 space-y-2">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            collapsed={collapsed}
            active={currentView === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <NavItem 
            icon={<FilePlus />} 
            label="New Complaint" 
            collapsed={collapsed}
            active={currentView === 'new'}
            onClick={() => onNavigate('new')}
          />
          <NavItem 
            icon={<FileSearch />} 
            label="Search" 
            collapsed={collapsed}
            active={currentView === 'search'}
            onClick={() => onNavigate('search')}
          />
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full scroll-container smooth-scroll p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-full animate-optimized"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
});

interface NavItemProps {
  icon: ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}

const NavItem = memo(function NavItem({ icon, label, collapsed, active, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center rounded-lg p-3 transition-all hw-accelerated ${
        active 
          ? 'bg-[#7C3AED] text-white' 
          : 'text-[#9CA3AF] hover:bg-[#2A2E38]'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="ml-3 font-medium"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}); 