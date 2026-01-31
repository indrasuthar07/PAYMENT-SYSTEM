import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Typography, message, Empty } from "antd";
import {
  BellOutlined,
  TransactionOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  QrcodeOutlined,
  EyeOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, Zap, Shield, UserPlus, Wallet, Send, CheckCircle } from "lucide-react";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TransferModal from "../Transictions/TransferModal";
import AddMoneyModal from "../Transictions/AddMoneyModal";
import PhoneMockup from "./PhoneMockup";
import { API_BASE_URL } from "../../config";

const { Title } = Typography;

const Home = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchUserBalance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalBalance(res.data?.user?.balance || 0);
    } catch {
      message.error("Failed to fetch balance");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data?.transactions || []);
    } catch {
      message.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBalance();
      fetchTransactions();
    }
  }, [user]);

  const reloadData = () => {
    fetchUserBalance();
    fetchTransactions();
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-t-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button type="primary" onClick={() => navigate("/signin")}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <>
      {/*hero section */}
<section className="mt-16  min-h-screen overflow-hidden bg-white flex items-center">
  {/* Background Blur Blobs */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]" />
    <div className="absolute top-[15%] left-[35%] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[100px]" />
    <div className="absolute bottom-[20%] right-[30%] w-[450px] h-[450px] bg-green-400/20 rounded-full blur-[110px]" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Trusted Badge & Greeting */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-6">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-sm font-medium text-gray-500">
            {greeting()}, {user.firstName} 👋
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] leading-[1.1] mb-6">
          Your Money, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
            Control,
          </span> Your Way
        </h1>

        {/* Sub-headline */}
        <p className="text-xl text-gray-500 font-medium max-w-lg mb-10 leading-relaxed">
          Send and receive payments instantly via QR code or account
          number. Fast, secure, and effortlessly simple.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <Button
            size="large"
            className="h-14 px-8 rounded-3xl bg-blue-600 text-white border-none text-lg font-semibold flex items-center hover:scale-105 transition-transform"
            onClick={() => document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" })}
          >
            Go to Wallet <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className=" flex px-8 gap-2 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl shadow-blue-500/50"
        >
          <p className=" uppercase tracking-widest text-gray-600 font-extrabold mt-3"> Balance</p>
          <div className="flex items-baseline">
            <span className="mt-2 text-xl font-black text-gray-900">$</span>
            <span className=" mt-2 text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              <CountUp end={totalBalance} decimals={2} duration={2} />
            </span>
          </div>
        </motion.div>
        </div>

        {/* Feature Icons */}
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <QrCode className="text-indigo-500" size={20} /> Scan & Pay
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Zap className="text-indigo-500" size={20} /> Instant Transfer
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Shield className="text-indigo-500" size={20} /> Bank-Grade Security
          </div>
        </div>
      </motion.div>

      {/* Right Content - Phone Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center lg:justify-end"
      >
        <div className="relative">
          <PhoneMockup />
          <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-[#2ecc71] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
            <ArrowUpOutlined className="text-white text-2xl rotate-45" />
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      <section id="dashboard" className="py-24 overflow-hidden bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full"
            >
              Dashboard Actions
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-600 mb-6"
            >
              Manage Your Money in <span className="text-transparent bg-clip-text bg-blue-600">Simple Steps</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-24 z-0" />

            {[
              {
                number: "1",
                title: "Add Money",
                desc: "Top up your wallet instantly using your linked bank or card.",
                icon: <PlusOutlined className="text-white text-3xl" />,
                color: "from-blue-600 to-blue-400",
                shadow: "shadow-blue-200",
                action: () => setShowAddMoneyModal(true),
              },
              {
                number: "2",
                title: "Transfer",
                desc: "Send money to friends or family via account number instantly.",
                icon: <SwapOutlined className="text-white text-3xl" />,
                color: "from-purple-600 to-purple-400",
                shadow: "shadow-purple-200",
                action: () => setShowTransferModal(true),
              },
              {
                number: "3",
                title: "Scan QR",
                desc: "Use your camera to scan a merchant QR code and pay effortlessly.",
                icon: <QrcodeOutlined className="text-white text-3xl" />,
                color: "from-indigo-600 to-indigo-400",
                shadow: "shadow-indigo-200",
                action: () => navigate("/qrcode"),
              },
              {
                number: "4",
                title: "View History",
                desc: "Track your spending and income with detailed real-time logs.",
                icon: <TransactionOutlined className="text-white text-3xl" />,
                color: "from-green-600 to-green-400",
                shadow: "shadow-green-200",
                action: () => navigate("/transactions"),
              },
            ].map((step, index) => (
              <motion.button
                key={index}
                onClick={step.action}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col items-center text-center z-10 bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <div className="relative mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-[2rem] flex items-center justify-center shadow-xl ${step.shadow} rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                    <div className="-rotate-3 group-hover:rotate-0 transition-transform flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold shadow-md border border-gray-50 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed px-4 text-sm">
                  {step.desc}
                </p>

                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to Open →
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      <TransferModal showTransferModal={showTransferModal} setShowTransferModal={setShowTransferModal} reloadData={reloadData} /> 
      <AddMoneyModal showAddMoneyModal={showAddMoneyModal} setShowAddMoneyModal={setShowAddMoneyModal} reloadData={reloadData} />
    </>
  );
};

export default Home;
