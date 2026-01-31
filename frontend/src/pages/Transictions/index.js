import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, message, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SwapOutlined,
  HistoryOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
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
      const res = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserBalance(res.data?.user?.balance || 0);
    } catch {
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" />
      </div>
    );
  }

  /* ======================= */
  /* ✅ CORRECTED TABLE LOGIC */
  /* ======================= */

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => (
        <Text copyable className="font-mono text-blue-600 font-medium">
          {id.substring(0, 10)}...
        </Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex flex-col">
          <Text strong>{new Date(date).toLocaleDateString()}</Text>
          <Text type="secondary" className="text-xs">
            {new Date(date).toLocaleTimeString()}
          </Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => {
        const userId = user._id;

        const isReceiver =
          record.receiver &&
          (record.receiver._id
            ? record.receiver._id === userId
            : record.receiver === userId);

        let label = type;
        if (type === 'transfer') {
          label = isReceiver ? 'credit' : 'debit';
        }

        const colorMap = {
          deposit: 'bg-green-100 text-green-600',
          credit: 'bg-green-100 text-green-600',
          debit: 'bg-red-100 text-red-600',
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              colorMap[label] || 'bg-blue-100 text-blue-600'
            }`}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const userId = user._id;

        const isDeposit = record.type === 'deposit';

        const isReceiver =
          record.receiver &&
          (record.receiver._id
            ? record.receiver._id === userId
            : record.receiver === userId);

        const isIncoming = isDeposit || isReceiver;

        return (
          <Text
            strong
            className={isIncoming ? 'text-green-600' : 'text-red-500'}
          >
            {isIncoming ? '+' : '-'}${Math.abs(amount).toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const map = {
          completed: { color: '#2ecc71', icon: <CheckCircleOutlined /> },
          pending: { color: '#f1c40f', icon: <HistoryOutlined /> },
          failed: { color: '#e74c3c', icon: <CloseCircleOutlined /> },
        }[status] || { color: '#95a5a6', icon: <HistoryOutlined /> };

        return (
          <Badge
            color={map.color}
            text={<span className="font-semibold">{status}</span>}
          />
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pb-20">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Title level={1} className="!font-black !mb-2">Transaction History</Title>
          <Text className="text-gray-500 text-lg">
            Monitor your spending and manage your digital assets.
          </Text>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Available Balance', value: userBalance, color: 'text-blue-600', icon: <WalletOutlined /> },
            { label: 'Monthly Income', value: monthlyIncome, color: 'text-green-600', icon: <ArrowUpOutlined /> },
            { label: 'Monthly Expense', value: monthlyExpense, color: 'text-red-600', icon: <ArrowDownOutlined /> },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl shadow flex justify-between">
              <div>
                <Text className="uppercase text-xs font-black">{stat.label}</Text>
                <div className={`text-3xl font-black ${stat.color}`}>
                  ${stat.value.toLocaleString()}
                </div>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex justify-end gap-3 mb-6">
            <Button onClick={() => setShowAddMoneyModal(true)} className="bg-blue-600 text-white">
              <PlusOutlined /> Add Funds
            </Button>
            <Button onClick={() => setShowTransferModal(true)} className="bg-gray-900 text-white">
              <SwapOutlined /> Transfer
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </div>
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
