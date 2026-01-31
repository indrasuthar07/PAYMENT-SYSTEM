import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ArrowRightLeft, 
  QrCode, 
  User, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  Zap 
} from 'lucide-react'; // Consistency with Home/Profile page

const navItems = [
  { key: 'home', icon: <Home size={18} />, label: 'Home', path: '/home' },
  { key: 'transactions', icon: <ArrowRightLeft size={18} />, label: 'History', path: '/transactions' },
  { key: 'qrcode', icon: <QrCode size={18} />, label: 'Scan & Pay', path: '/qrcode' },
  { key: 'profile', icon: <User size={18} />, label: 'Profile', path: '/profile' },
  { key: 'settings', icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* COOL LOGO SECTION */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => navigate('/home')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">
              PAY<span className="text-blue-600">WALLET</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 leading-none mt-1">
              Secure Digital Core
            </span>
          </div>
        </div>

        {/* Desktop Nav - Pill Style */}
        <div className="hidden md:flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  isActive 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                }`}
              >
                {item.icon}
                <span className="hidden lg:block">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2.5 rounded-xl bg-gray-900 text-white" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Animated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-2 shadow-2xl"
          >
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.key}
                  onClick={() => { setMenuOpen(false); navigate(item.path); }}
                  className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                  <span className="text-sm uppercase tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;