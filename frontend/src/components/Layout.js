import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

function Layout() {
  const moneyIcons = ['₹', '$', '€', '₿'];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800 relative overflow-hidden">

      {/* Animated Floating Money Icons */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
          const icon = moneyIcons[Math.floor(Math.random() * moneyIcons.length)];
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 24 + 16;
          const delay = Math.random() * 20;
          const duration = 25 + Math.random() * 20;

          return (
            <span
              key={i}
              className="absolute text-blue-400 opacity-10 select-none"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                fontSize: `${size}px`,
                animation: `floatUp ${duration}s linear ${delay}s infinite`
              }}
            >
              {icon}
            </span>
          );
        })}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow w-full flex items-center justify-center px-4 sm:px-8 md:px-12 py-6 relative z-10">
        <div className="w-full max-w-6xl bg-white backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-10 md:p-14">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Footer */}
      <footer className="bg-white text-gray-500 p-6 text-center border-t border-gray-200 shadow-sm z-10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-3">
          <span className="text-sm">&copy; {new Date().getFullYear()} Pay-Wallet. All rights reserved.</span>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Layout;
