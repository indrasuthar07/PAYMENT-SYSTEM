import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  ArrowRightLeft, 
  QrCode, 
  User, 
  Settings 
} from 'lucide-react'; // Using Lucide for consistency

const navItems = [
  { key: 'home', icon: <Home size={20} />, label: 'Home', path: '/home' },
  { key: 'transactions', icon: <ArrowRightLeft size={20} />, label: 'History', path: '/transactions' },
  { key: 'qrcode', icon: <QrCode size={20} />, label: 'QR', path: '/qrcode' },
  { key: 'profile', icon: <User size={20} />, label: 'Profile', path: '/profile' },
  { key: 'settings', icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
];

function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] flex justify-around items-center py-4 px-2 z-50 md:hidden shadow-2xl shadow-blue-500/10">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className="relative flex flex-col items-center focus:outline-none group"
          >
            {/* Active Indicator Glow */}
            {isActive && (
              <motion.div 
                layoutId="mobileActive"
                className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full"
              />
            )}

            <div className={`p-2 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-gray-400'
            }`}>
              {item.icon}
            </div>

            <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {item.key === 'qrcode' ? 'QR' : item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNav;