import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { Zap } from 'lucide-react';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-gray-100 bg-transparent">

      {/* Animated Blue-Green Grid Background */}
      <div className="absolute inset-0 -z-30 bg-blur-lg bg-gradient-to-br from-blue-200 to-green-100 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,180,0.2)_1px,transparent_3px),linear-gradient(to_bottom,rgba(0,150,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] animate-gridMove"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,180,0.1),transparent_70%)]"></div>
      </div>

      {/* Navbar */}
      <Navbar className="bg-blur-md text-white shadow-lg" />

      {/* Main Content */}
      <main className="flex-grow w-full relative z-10 bg-transparent">
        <Outlet />
      </main>


      {/* Mobile Navigation */}
      <MobileNav />

  <footer className="py-12 bg-white relative overflow-hidden">
  {/* Subtle top divider with gradient */}
  <div className="max-w-7xl mx-auto px-6">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />
    
    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
      {/* Brand & Status */}
      <div className="flex flex-col items-center md:items-start gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Zap className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">PayWallet</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">All Systems Live</span>
        </div>
      </div>

      {/* Simplified Links */}
      <div className="flex gap-8 text-sm font-semibold text-gray-500">
        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
      </div>

      {/* Copyright */}
      <p className="text-sm text-gray-400 font-medium">
        &copy; {new Date().getFullYear()} Pay-Wallet.
      </p>
    </div>
  </div>
</footer>
      {/* Animations */}
      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }
        .animate-gridMove { animation: gridMove 20s linear infinite; }
      `}</style>
    </div>
  );
}

export default Layout;
