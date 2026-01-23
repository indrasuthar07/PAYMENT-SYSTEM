import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Typography, message, Empty } from 'antd';
import {
  WalletOutlined, TransactionOutlined, CreditCardOutlined, BankOutlined,
  BellOutlined, ArrowUpOutlined, ArrowDownOutlined,
  QrcodeOutlined, EyeOutlined, PlusOutlined, SwapOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TransferModal from '../Transictions/TransferModal';
import AddMoneyModal from '../Transictions/AddMoneyModal';
import axios from 'axios';
import CountUp from 'react-countup';

import { API_BASE_URL } from '../../config';

const { Title } = Typography;



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
  const [userBalance, setUserBalance] = useState(0);
  const token = localStorage.getItem('token');

  // Calculate monthly stats from transactions
  const calculateMonthlyStats = (transactions, userId) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => {
        if (t.type === 'deposit' && t.status === 'completed') return true;
        if (t.type === 'transfer' && t.receiver && (t.receiver._id === userId || t.receiver.toString() === userId)) return true;
        return false;
      })
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const expense = monthlyTransactions
      .filter(t => {
        if (t.type === 'transfer' && t.sender && (t.sender._id === userId || t.sender.toString() === userId)) return true;
        return false;
      })
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    return { income, expense };
  };

  // Fetch user balance
  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.user) {
        const balance = response.data.user.balance || 0;
        setUserBalance(balance);
        setQuickStats(prev => ({
          ...prev,
          totalBalance: balance
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
        const fetchedTransactions = response.data.transactions || [];
        setTransactions(fetchedTransactions);

        // Calculate monthly stats
        if (user?.id) {
          const { income, expense } = calculateMonthlyStats(fetchedTransactions, user.id);
          setQuickStats(prev => ({
            ...prev,
            monthlyIncome: income,
            monthlyExpense: expense
          }));
        }
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

  // Reload data after modal actions
  const reloadData = () => {
    fetchUserBalance();
    fetchTransactions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-2">Welcome!</span>
          <span className="text-lg text-gray-500 mb-6">Sign in to access your wallet dashboard</span>
          <button
            onClick={() => navigate('/signin')}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="w-full min-h-screen py-6 px-2 sm:px-6 md:px-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center">
      <div className="glass-card w-full max-w-5xl mx-auto p-4 sm:p-8 shadow-2xl mb-8 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">
              {greeting()}, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="text-gray-600 text-sm">Here's your wallet overview</p>
          </div>
          <Badge count={0} showZero={false} offset={[-5, 5]}>
            <Button
              type="primary"
              shape="round"
              icon={<BellOutlined />}
              size="middle"
              className="bg-gradient-to-r from-blue-600 to-blue-400 border-none shadow-md"
            >
              <span className="hidden sm:inline">Notifications</span>
            </Button>
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Balance Card */}
          <Card className="glass-card p-3 flex flex-col sm:p-4 items-center shadow-lg bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl border-none">
            <span className="text-xs sm:text-xl font-bold text-gray-600 mb-1">Total Balance</span>
            <span className="text-xs sm:text-lg font-bold text-gray-800">
              $<CountUp end={quickStats.totalBalance} decimals={2} duration={1} />
            </span>
          </Card>

          {/* Income Card */}
          <Card className="glass-card p-3 flex flex-col sm:p-4 items-center shadow-lg bg-gradient-to-br from-green-500 to-green-300 rounded-xl border-none">
            <span className="text-xs sm:text-xl font-bold text-green-400 mb-1">Monthly Income</span>
            <span className="text-xs sm:text-lg font-bold text-green-600">
              $<CountUp end={quickStats.monthlyIncome} decimals={2} duration={1} />
            </span>
          </Card>

          {/* Expense Card */}
          <Card className="glass-card p-3 flex flex-col sm:p-4 items-center shadow-lg bg-gradient-to-br from-red-500 to-red-300 rounded-xl border-none">
            <span className="text-xs sm:text-xl font-bold text-red-400 mb-1">Monthly Expense</span>
            <span className="text-xs sm:text-xl font-bold text-red-600">
              $<CountUp end={quickStats.monthlyExpense} decimals={2} duration={1} />
            </span>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="w-full mb-6">
          <Title level={5} className="mb-3 text-blue-700 text-base text-center sm:text-left">Quick Actions</Title>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setShowAddMoneyModal(true)}
              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <PlusOutlined className="text-2xl mb-1" />
              <span className="font-semibold text-xs sm:text-sm">Add Money</span>
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <SwapOutlined className="text-2xl mb-1" />
              <span className="font-semibold text-xs sm:text-sm">Transfer</span>
            </button>
            <button
              onClick={() => navigate('/qrcode')}
              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <QrcodeOutlined className="text-2xl mb-1" />
              <span className="font-semibold text-xs sm:text-sm">QR Code</span>
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <TransactionOutlined className="text-2xl mb-1" />
              <span className="font-semibold text-xs sm:text-sm">Transactions</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="mb-0 text-blue-700 text-base">Recent Transactions</Title>
            <Button
              type="link"
              onClick={() => navigate('/transactions')}
              className="text-blue-600 p-0 h-auto text-xs sm:text-sm"
            >
              View All <EyeOutlined />
            </Button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => {
                const isIncome = transaction.type === 'deposit' ||
                  (transaction.type === 'transfer' &&
                    transaction.receiver &&
                    (transaction.receiver._id === user?.id || transaction.receiver.toString() === user?.id));
                const amount = parseFloat(transaction.amount) || 0;

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                        {isIncome ? (
                          <ArrowUpOutlined className="text-green-600 text-sm" />
                        ) : (
                          <ArrowDownOutlined className="text-red-600 text-sm" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize text-sm">{transaction.type}</p>
                        <p className="text-xs text-gray-500">{transaction.description || 'No description'}</p>
                        <p className="text-xs text-gray-400">{new Date(transaction.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}${amount.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              description={<span className="text-gray-600 text-sm">No transactions yet</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                onClick={() => setShowAddMoneyModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-400 border-none shadow-md mt-3 text-xs"
              >
                Add Money
              </Button>
            </Empty>
          )}
        </div>
      </div>

      {/* Modals */}
      <TransferModal
        showTransferModal={showTransferModal}
        setShowTransferModal={setShowTransferModal}
        reloadData={reloadData}
      />
      <AddMoneyModal
        showAddMoneyModal={showAddMoneyModal}
        setShowAddMoneyModal={setShowAddMoneyModal}
        reloadData={reloadData}
      />
    </div>
  );
};

export default Home;
