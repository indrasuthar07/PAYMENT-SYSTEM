import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

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
     <main className="flex-grow w-full flex items-center justify-center px-4 sm:px-8 md:px-12 py-6 relative z-10 bg-transparent">
  <div className="w-full max-w-6xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-blue-400 p-6 sm:p-10 md:p-14 text-blue-600 animate-fadeIn scale-100 hover:scale-[1.01] transition-transform duration-500 ease-out">

    <h1 className="text-4xl font-extrabold text-center mb-6  animate-slideUp">
      Welcome to Pay-Wallet
    </h1>

    <p className="text-center text-gray-700 mb-8 text-lg leading-relaxed">
      Your one-stop solution for <span className="font-bold text-blue-600">secure</span> and <span className="font-bold text-purple-500">easy</span> online payments. 
      Explore our features and manage your transactions seamlessly.
    </p>

    <Outlet />
  </div>

  {/* Animations */}
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
    .animate-slideUp { animation: slideUp 1s ease-out forwards; }
  `}</style>
</main>


      {/* Mobile Navigation */}
      <MobileNav />

      {/* Footer */}
      <footer className="bg-blur text-black p-12 text-center border-t border-blue-700 shadow-2xl z-10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4">
          <span className="text-sm">&copy; {new Date().getFullYear()} Pay-Wallet. All rights reserved.</span>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-green-400 transition-transform transform hover:scale-110">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-transform transform hover:scale-110">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition-transform transform hover:scale-110">Contact</a>
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
