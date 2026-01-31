import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, message, Typography } from 'antd';
import {
  TransactionOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  PlusOutlined,
  SwapOutlined,
  HistoryOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion'; // Added for Home page feel
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import TransferModal from './TransferModal';
import AddMoneyModal from './AddMoneyModal';

const { Title, Text } = Typography;

function Transactions() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const income = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    const expense = Math.floor(Math.random() * (income * 0.6));
    setMonthlyIncome(income);
    setMonthlyExpense(expense);
  }, []);

  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUserBalance(response.data.user.balance || 0);
      }
    } catch (error) {
      message.error('Failed to fetch user balance');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchTransactions();
    fetchUserBalance();
  }, [user, navigate]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <Text copyable className="font-mono text-blue-600 font-medium">{text.substring(0, 10)}...</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex flex-col">
          <Text strong>{new Date(date).toLocaleDateString()}</Text>
          <Text type="secondary" className="text-xs">{new Date(date).toLocaleTimeString()}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {type}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text strong className={record.type === 'deposit' ? 'text-green-600' : 'text-red-500'}>
          {record.type === 'deposit' ? '+' : '-'}${Math.abs(amount).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          completed: { color: '#2ecc71', icon: <CheckCircleOutlined /> },
          pending: { color: '#f1c40f', icon: <HistoryOutlined /> },
          failed: { color: '#e74c3c', icon: <CloseCircleOutlined /> }
        }[status] || { color: '#95a5a6', icon: <HistoryOutlined /> };
        return <Badge color={config.color} text={<span className="font-semibold text-gray-600">{status}</span>} />;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pb-20">
      {/* Background Glows matching Home page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <HistoryOutlined className="text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Financial Records</span>
          </div>
          <Title level={1} className="!font-black !mb-2">Transaction History</Title>
          <Text className="text-gray-500 text-lg">Monitor your spending and manage your digital assets.</Text>
        </motion.div>

        {/* Stats Grid - Home Page Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Available Balance", value: userBalance, color: "text-blue-600", bg: "bg-blue-50", icon: <WalletOutlined /> },
            { label: "Monthly Income", value: monthlyIncome, color: "text-green-600", bg: "bg-green-50", icon: <ArrowUpOutlined /> },
            { label: "Monthly Expense", value: monthlyExpense, color: "text-red-600", bg: "bg-red-50", icon: <ArrowDownOutlined /> }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between"
            >
              <div>
                <Text type="secondary" className="uppercase text-[10px] font-black tracking-widest">{stat.label}</Text>
                <div className={`text-3xl font-black ${stat.color} block mt-1`}>${stat.value.toLocaleString()}</div>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table Container - Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden p-4 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <Title level={4} className="!mb-0 !font-bold">Recent Activity</Title>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowAddMoneyModal(true)}
                className="h-12 px-6 rounded-xl bg-blue-600 text-white border-none font-bold hover:scale-105 transition-transform"
              >
                <PlusOutlined /> Add Funds
              </Button>
              <Button 
                onClick={() => setShowTransferModal(true)}
                className="h-12 px-6 rounded-xl bg-gray-900 text-white border-none font-bold hover:scale-105 transition-transform"
              >
                <SwapOutlined /> Transfer
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 8, className: "custom-pagination" }}
              className="custom-table"
            />
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddMoneyModal
        showAddMoneyModal={showAddMoneyModal}
        setShowAddMoneyModal={setShowAddMoneyModal}
        reloadData={() => { fetchTransactions(); fetchUserBalance(); }}
      />
      <TransferModal
        showTransferModal={showTransferModal}
        setShowTransferModal={setShowTransferModal}
        reloadData={() => { fetchTransactions(); fetchUserBalance(); }}
      />
    </div>
  );
}

export default Transactions;