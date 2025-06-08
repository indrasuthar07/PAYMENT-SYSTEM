import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Progress, List, Badge, Avatar, Typography, Carousel, Tooltip, Table, message, Space } from 'antd';
import {
    ArrowUpOutlined, ArrowDownOutlined, WalletOutlined,
    TransactionOutlined, CreditCardOutlined, BankOutlined,
    BellOutlined, StarOutlined, FireOutlined, RocketOutlined,
    SafetyCertificateOutlined, TeamOutlined, ThunderboltOutlined,
    CrownOutlined, GiftOutlined, LineChartOutlined, BarChartOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TransferModal from '../Transictions/TransferModal';
import AddMoneyModal from '../Transictions/AddMoneyModal';
import axios from 'axios';
import CountUp from 'react-countup';

const { Title, Text } = Typography;

const Home = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [quickStats, setQuickStats] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        savingsRate: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const token = localStorage.getItem('token');

    const fetchUserBalance = async () => {
        if (!token) return;
        
        try {
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.user) {
                setQuickStats(prev => ({
                    ...prev,
                    totalBalance: response.data.user.balance || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
            message.error('Failed to fetch user balance');
        }
    };

    const fetchTransactions = async () => {
        if (!token) return;
        
        setLoadingTransactions(true);
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
            setLoadingTransactions(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserBalance();
            fetchTransactions();
        }
    }, [user]);

    const handleTransactionSuccess = async () => {
        await Promise.all([
            fetchTransactions(),
            fetchUserBalance()
        ]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50">
                    <Title level={4} style={{ color: 'white' }}>Please sign in to view your dashboard</Title>
                    <Button type="primary" onClick={() => navigate('/signin')}>
                        Sign In
                    </Button>
                </Card>
            </div>
        );
    }

    const quickActions = [
        { icon: <WalletOutlined />, title: 'Add Money', color: 'text-green-600', onClick: () => setShowAddMoneyModal(true), description: 'Add funds to your wallet' },
        { icon: <TransactionOutlined />, title: 'Send Money', color: 'text-blue-600', onClick: () => setShowTransferModal(true), description: 'Transfer to others' },
        { icon: <CreditCardOutlined />, title: 'Link Card', color: 'text-purple-600', onClick: () => navigate('/link-card'), description: 'Connect your cards' },
        { icon: <BankOutlined />, title: 'Link Bank', color: 'text-yellow-600', onClick: () => navigate('/link-bank'), description: 'Connect your bank' }
    ];

    const features = [
        {
            icon: <SafetyCertificateOutlined className="text-4xl text-blue-400" />,
            title: 'Secure Transactions',
            description: 'VIP security for all your transactions'
        },
        {
            icon: <TeamOutlined className="text-4xl text-green-400" />,
            title: 'Split Bills',
            description: 'Easily split expenses with friends and family'
        },
        {
            icon: <FireOutlined className="text-4xl text-purple-400" />,
            title: 'Instant Transfers',
            description: 'Send money instantly to anyone, anywhere'
        }
    ];

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <span style={{ color: type === 'deposit' ? 'green' : 'blue' }}>
                    {type === 'deposit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                    {' '}{type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `$${amount.toFixed(2)}`
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString()
        }
    ];

    return (
        <div style={{ background: '#C0C0C0', minHeight: '100vh' }} className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
            {/* Welcome Section */}
            <Card style={{ background: '#2563eb', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,58,138,0.08)' }} className="border-none backdrop-blur-lg bg-opacity-90 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <Title level={2} style={{ color: 'white', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }} className="animate-fade-in">
                            Welcome back, {user?.firstName}! 👋
                        </Title>
                        <Text style={{ color: 'white', fontSize: 18, opacity: 0.95 }}>
                            Here's what's happening with your account today.
                        </Text>
                    </div>
                    <Badge count={3} size="small">
                        <Button
                            type="primary"
                            icon={<BellOutlined style={{ color: '#2563eb', fontSize: 22 }} />}
                            style={{ background: 'white', color: '#2563eb', border: 'none', borderRadius: 8, fontWeight: 600, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}
                            className="hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
                        >
                            Notifications
                        </Button>
                    </Badge>
                </div>
            </Card>

            {/* Quick Stats */}
            <Row gutter={[24, 24]} className="mb-2">
                {[
                    {
                        icon: <LineChartOutlined style={{ color: '#2563eb', fontSize: 28 }} />, label: 'Total Balance', value: quickStats.totalBalance, color: '#2563eb', prefix: '$', decimals: 2
                    },
                    {
                        icon: <BarChartOutlined style={{ color: '#2563eb', fontSize: 28 }} />, label: 'Monthly Income', value: 15500, color: '#05ad2a', prefix: '$', decimals: 2
                    },
                    {
                        icon: <BarChartOutlined style={{ color: '#2563eb', fontSize: 28 }} />, label: 'Monthly Expense', value: 7000, color: '#ad1905', prefix: '$', decimals: 2
                    },
                    {
                        icon: <LineChartOutlined style={{ color: '#2563eb', fontSize: 28 }} />, label: 'Savings Rate', value: 54.84, color: '#2563eb', suffix: '%', decimals: 1
                    }
                ].map((stat, idx) => (
                    <Col xs={24} sm={12} md={6} key={idx}>
                        <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }} className="h-full flex flex-col justify-between">
                            <div className="flex flex-col gap-1">
                                <span style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 18 }} className="flex items-center gap-2 mb-1">
                                    {stat.icon} {stat.label}
                            </span>
                                <div style={{ color: stat.color, fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px' }}>
                                <CountUp
                                    start={0}
                                        end={stat.value}
                                    duration={2}
                                    separator=","
                                        decimals={stat.decimals}
                                        prefix={stat.prefix || ''}
                                        suffix={stat.suffix || ''}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
                ))}
            </Row>

            {/* Divider */}
            <div className="w-full h-0.5 bg-blue-100 rounded-full my-4" />

            {/* Quick Actions  */}
            <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }} className="mb-6">
                <Title level={4} style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 16 }} className="flex items-center">
                    <ThunderboltOutlined style={{ color: '#2563eb', marginRight: 8, fontSize: 22 }} /> Quick Actions
                </Title>
                <Row gutter={[16, 16]}>
                    {quickActions.map((action, index) => (
                        <Col xs={12} sm={6} key={index}>
                            <Tooltip title={action.description}>
                                <Button
                                    type="text"
                                    style={{ color: '#2563eb', background: '#f0f6ff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 16 }}
                                    className="w-full h-24 flex flex-col items-center justify-center hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
                                    onClick={action.onClick}
                                >
                                    <div className="text-2xl mb-2" style={{ color: '#2563eb', fontSize: 28 }}>{action.icon}</div>
                                    <span style={{ color: '#1e3a8a' }}>{action.title}</span>
                                </Button>
                            </Tooltip>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Divider */}
            <div className="w-full h-0.5 bg-blue-100 rounded-full my-4" />

            {/* Features */}
            <Card style={{ background: '#2563eb', borderRadius: 14, boxShadow: '0 2px 12px rgba(37,99,235,0.08)' }} className="mb-6">
                <Title level={4} style={{ color: 'white', fontWeight: 700, marginBottom: 16 }} className="flex items-center">
                    <SafetyCertificateOutlined style={{ color: 'white', marginRight: 8, fontSize: 22 }} /> Secure Transactions
                </Title>
                <Carousel autoplay effect="fade">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6">
                            <div className="text-center transform hover:scale-105 transition-all duration-300">
                                {React.cloneElement(feature.icon, { style: { color: 'white', fontSize: 36 } })}
                                <Title level={3} style={{ color: 'white', fontWeight: 700, marginTop: 16 }}>{feature.title}</Title>
                                <Text style={{ color: '#e0e7ef', fontSize: 16 }}>{feature.description}</Text>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </Card>

            {/* Divider */}
            <div className="w-full h-0.5 bg-blue-100 rounded-full my-4" />

            {/* Recent Transactions */}
            <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <Title level={4} style={{ color: '#1e3a8a', fontWeight: 700, marginBottom: 16 }} className="flex items-center">
                    <TransactionOutlined style={{ color: '#2563eb', marginRight: 8, fontSize: 22 }} /> Recent Transactions
                </Title>
                <Table
                    columns={columns}
                    dataSource={transactions}
                    loading={loadingTransactions}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            {/* Modals */}
            <TransferModal
                showTransferModal={showTransferModal}
                setShowTransferModal={setShowTransferModal}
                reloadData={handleTransactionSuccess}
            />
            <AddMoneyModal
                showAddMoneyModal={showAddMoneyModal}
                setShowAddMoneyModal={setShowAddMoneyModal}
                reloadData={handleTransactionSuccess}
            />
        </div>
    );
};

export default Home; 