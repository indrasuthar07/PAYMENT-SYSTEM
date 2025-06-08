import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Progress, List, Badge, Avatar, Typography, Carousel, Tooltip, Table, Input, Select, DatePicker, Space, Tag, Divider, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, 
         TransactionOutlined, CreditCardOutlined, BankOutlined,
         BellOutlined, StarOutlined, FireOutlined, RocketOutlined,
         SafetyCertificateOutlined, TeamOutlined, ThunderboltOutlined,
         CrownOutlined, GiftOutlined, LineChartOutlined, BarChartOutlined,
         SearchOutlined, FilterOutlined, DownloadOutlined, ReloadOutlined,
         DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
         EyeOutlined, FileExcelOutlined, FilePdfOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransferModal from './TransferModal';
import AddMoneyModal from './AddMoneyModal';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

function Transactions() {
    const { user, loading: authLoading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const token = localStorage.getItem('token');

    const fetchTransactions = async () => {
        if (!token) return;
        
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            message.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBalance = async () => {
        if (!token) return;
        
        try {
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.user) {
                setUserBalance(response.data.user.balance || 0);
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
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
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl text-red-500 mb-4">Please sign in to view your transactions</h2>
                <Button type="primary" onClick={() => navigate('/signin')}>
                    Go to Sign In
                </Button>
            </div>
        );
    }

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: '_id',
            key: '_id',
            render: (text) => (
                <Tooltip title="Click to view details">
                    <Text className="font-mono text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Date & Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-gray-400" />
                    <div className="flex flex-col">
                        <Text className="text-white">{new Date(date).toLocaleDateString()}</Text>
                        <Text className="text-gray-400 text-xs">{new Date(date).toLocaleTimeString()}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag 
                    color={type === 'deposit' ? 'green' : 'blue'} 
                    className="font-mono px-3 py-1 rounded-full transform hover:scale-105 transition-transform"
                >
                    {type === 'deposit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <div className="flex items-center gap-2">
                    <DollarOutlined className={amount > 0 ? 'text-green-400' : 'text-red-400'} />
                    <Text className={`font-bold ${amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.abs(amount).toFixed(2)}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusConfig = {
                    completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
                    pending: { color: 'gold', icon: <ClockCircleOutlined />, text: 'Pending' },
                    failed: { color: 'red', icon: <CloseCircleOutlined />, text: 'Failed' }
                };
                const config = statusConfig[status] || statusConfig.pending;
                return (
                    <Badge 
                        status={config.color} 
                        text={
                            <span className="flex items-center gap-1">
                                {config.icon} {config.text}
                            </span>
                        }
                        className="transform hover:scale-105 transition-transform"
                    />
                );
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <Tooltip title={text}>
                    <Text className="text-gray-400 hover:text-gray-300 transition-colors cursor-help">
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => {
                                // Handle view details
                                message.info('View details functionality coming soon');
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction._id.toLowerCase().includes(searchText.toLowerCase()) ||
                            transaction.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        const matchesDate = !dateRange || (
            new Date(transaction.createdAt) >= dateRange[0].startOf('day').toDate() &&
            new Date(transaction.createdAt) <= dateRange[1].endOf('day').toDate()
        );
        return matchesSearch && matchesStatus && matchesDate;
    });

    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;
    const successRate = (completedTransactions / filteredTransactions.length) * 100 || 0;
    const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;
    const failedTransactions = filteredTransactions.filter(t => t.status === 'failed').length;

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const handleAddMoneySuccess = () => {
        setShowAddMoneyModal(false);
        fetchTransactions();
        fetchUserBalance();
    };

    const handleTransferSuccess = () => {
        setShowTransferModal(false);
        fetchTransactions();
        fetchUserBalance();
    };

    return (
        <div style={{ background: '#C0C0C0', minHeight: '100vh' }} className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
            <Card style={{ background: '#2563eb', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,58,138,0.08)' }} className="border-none backdrop-blur-lg bg-opacity-90 mb-6">
            <div>
                        <Title level={2} style={{ color: 'white', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }} className="animate-fade-in">
                        <TransactionOutlined className="text-4xl" />
                        Transactions
                        </Title>
                        <Text style={{ color: 'white', fontSize: 18, opacity: 0.95 }}>
                        View your latest transactions and keep track of your spending
                        </Text>
                    </div>
                  
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <WalletOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-600 text-sm">Total Balance</h3>
                            <p className="text-2xl font-bold text-blue-600">${userBalance}</p>
                        </div>
                    </div>
                </Card>

                <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowUpOutlined className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-600 text-sm">Total Income</h3>
                            <p className="text-2xl font-bold text-green-600">${totalAmount}</p>
                        </div>
                    </div>
                </Card>

                <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <ArrowDownOutlined className="text-2xl text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-600 text-sm">Total Expenses</h3>
                            <p className="text-2xl font-bold text-red-600">${0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl text-blue-600">Transaction History</h3>
                    <div className="flex gap-4">
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                            onClick={() => setShowAddMoneyModal(true)}
                        >
                            Add Money
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<SwapOutlined />}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                            onClick={() => setShowTransferModal(true)}
                        >
                            Transfer
                        </Button>
                    </div>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={filteredTransactions}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    className="custom-table"
                />
            </Card>

            <AddMoneyModal 
                showAddMoneyModal={showAddMoneyModal}
                setShowAddMoneyModal={setShowAddMoneyModal}
                reloadData={handleAddMoneySuccess}
            />

            <TransferModal 
                showTransferModal={showTransferModal}
                setShowTransferModal={setShowTransferModal}
                reloadData={handleTransferSuccess}
            />
        </div>
    );
}

export default Transactions;