import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Typography, message, Tooltip } from 'antd';
import {
  WalletOutlined, TransactionOutlined, CreditCardOutlined, BankOutlined,
  BellOutlined, ThunderboltOutlined, DollarOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TransferModal from '../Transictions/TransferModal';
import AddMoneyModal from '../Transictions/AddMoneyModal';
import axios from 'axios';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const API_BASE_URL = process.env.VITE_API_BASE_URL


const Home = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0
  });
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch user balance
  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.user) {
        setQuickStats(prev => ({
          ...prev,
          totalBalance: response.data.user.balance || 0,
          monthlyIncome: 15500,
          monthlyExpense: 7000
        }));
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch user balance');
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBalance();
      fetchTransactions();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-2">Welcome!</span>
          <span className="text-lg text-gray-500 mb-6">Sign in to access your wallet dashboard</span>
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { icon: <WalletOutlined />, title: 'Add Money', onClick: () => setShowAddMoneyModal(true), color: 'bg-green-500' },
    { icon: <TransactionOutlined />, title: 'Send Money', onClick: () => setShowTransferModal(true), color: 'bg-blue-500' },
    { icon: <CreditCardOutlined />, title: 'Link Card', onClick: () => navigate('/link-card'), color: 'bg-purple-500' },
    { icon: <BankOutlined />, title: 'Link Bank', onClick: () => navigate('/link-bank'), color: 'bg-pink-500' }
  ];

  return (
    <div className="relative w-full py-6 px-4 sm:px-8 md:px-16 space-y-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen text-gray-800 overflow-hidden">
      
      {/* Floating BG Icons */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <DollarOutlined
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              color: 'rgba(0,0,0,0.05)',
              animation: `float ${10 + Math.random() * 10}s linear infinite`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(-30px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 0.1; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 relative z-10">
        <div>
          <span className="block text-2xl font-bold text-blue-700 mb-1">{greeting()}, {user?.firstName}! 👋</span>
          <span className="block text-gray-500 text-lg">Here’s your wallet overview.</span>
        </div>
        <Badge count={3} offset={[-5, 5]}>
          <Button type="primary" shape="round" icon={<BellOutlined />} size="large" className="bg-blue-500 hover:bg-blue-600 border-none shadow-md">
            Notifications
          </Button>
        </Badge>
      </div>


      <TransferModal showTransferModal={showTransferModal} setShowTransferModal={setShowTransferModal} reloadData={fetchTransactions} />
      <AddMoneyModal showAddMoneyModal={showAddMoneyModal} setShowAddMoneyModal={setShowAddMoneyModal} reloadData={fetchTransactions} />
    </div>
  );
};

export default Home;
