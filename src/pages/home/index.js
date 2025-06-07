import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Progress, List, Badge, Avatar, Typography, Carousel, Tooltip } from 'antd';
import {
    ArrowUpOutlined, ArrowDownOutlined, WalletOutlined,
    TransactionOutlined, CreditCardOutlined, BankOutlined,
    BellOutlined, StarOutlined, FireOutlined, RocketOutlined,
    SafetyCertificateOutlined, TeamOutlined, ThunderboltOutlined,
    CrownOutlined, GiftOutlined, LineChartOutlined, BarChartOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function Home() {
    const user = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [quickStats, setQuickStats] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        savingsRate: 0
    });

    useEffect(() => {
        const transactions = user?.transactions || [];
        setRecentTransactions(transactions.slice(0, 5));

        const totalBalance = user?.balance || 0;
        const monthlyIncome = transactions
            .filter(t => t.type === 'credit' && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpense = transactions
            .filter(t => t.type === 'debit' && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const savingsRate = monthlyIncome ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

        setQuickStats({
            totalBalance,
            monthlyIncome,
            monthlyExpense,
            savingsRate
        });
    }, [user?.transactions, user?.balance]);

    const quickActions = [
        { icon: <WalletOutlined />, title: 'Add Money', color: 'text-green-400', path: '/add-money', description: 'Add funds to your wallet' },
        { icon: <TransactionOutlined />, title: 'Send Money', color: 'text-blue-400', path: '/send-money', description: 'Transfer to others' },
        { icon: <CreditCardOutlined />, title: 'Link Card', color: 'text-purple-400', path: '/link-card', description: 'Connect your cards' },
        { icon: <BankOutlined />, title: 'Link Bank', color: 'text-yellow-400', path: '/link-bank', description: 'Connect your bank' }
    ];

    const features = [
        {
            icon: <SafetyCertificateOutlined className="text-4xl text-blue-400" />,
            title: 'Secure Transactions',
            description: 'Bank-grade security for all your transactions'
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

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-4">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-400 border-none shadow-2xl backdrop-blur-lg bg-opacity-90">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-white mb-4 md:mb-0">
                        <Title level={2} className="text-white mb-2 animate-fade-in">
                            Welcome back, {user?.firstName}! 👋
                        </Title>
                        <Text className="text-blue-100 text-lg">
                            Here's what's happening with your account today.
                        </Text>
                    </div>
                    <Badge count={3} size="small">
                        <Button
                            type="primary"
                            icon={<BellOutlined />}
                            className="bg-white text-blue-500 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 rounded-lg"
                        >
                            Notifications
                        </Button>
                    </Badge>
                </div>
            </Card>

            {/* Quick Stats */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 text-xl flex items-center gap-2"><LineChartOutlined /> Total Balance</span>}
                            value={quickStats.totalBalance}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#60A5FA' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-400/50 hover:border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 text-xl flex items-center gap-2"><BarChartOutlined /> Monthly Income</span>}
                            value={quickStats.monthlyIncome}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#34D399' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-red-400/50 hover:border-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 text-xl flex items-center gap-2"><BarChartOutlined /> Monthly Expense</span>}
                            value={quickStats.monthlyExpense}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#EF4444' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-400/50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 text-xl flex items-center gap-2"><LineChartOutlined /> Savings Rate</span>}
                            value={quickStats.savingsRate}
                            precision={1}
                            suffix="%"
                            valueStyle={{ color: '#A78BFA' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions  */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm">
                <Title level={4} style={{ color: 'white' }} className="mb-4 flex items-center">
                    <ThunderboltOutlined className="mr-2 text-yellow-400" /> Quick Actions
                </Title>
                <Row gutter={[16, 16]}>
                    {quickActions.map((action, index) => (
                        <Col xs={12} sm={6} key={index}>
                            <Tooltip title={action.description}>
                                <Button
                                    type="text"
                                    className={`w-full h-24 flex flex-col items-center justify-center ${action.color} hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 rounded-xl`}
                                    onClick={() => navigate(action.path)}
                                >
                                    <div className="text-2xl mb-2">{action.icon}</div>
                                    <span>{action.title}</span>
                                </Button>
                            </Tooltip>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Features */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm">
                <Title level={4} style={{ color: 'white' }} className="mb-4 flex items-center">
                    <SafetyCertificateOutlined className=" text-yellow-400 mr-2" /> Secure Transactions
                </Title>
                <Carousel autoplay effect="fade">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6">
                            <div className="text-center transform hover:scale-105 transition-all duration-300">
                                {feature.icon}
                                <Title level={3} style={{ color: 'white' }} className="text-white mt-4">{feature.title}</Title>
                                <Text className="text-gray-400">{feature.description}</Text>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                    <Title level={4} style={{ color: 'white' }} className="flex items-center">
                        <GiftOutlined className="text-yellow-400 mr-2" /> Recent Transactions
                    </Title>
                    <Button
                        type="link"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={() => navigate('/transactions')}
                    >
                        View All
                    </Button>
                </div>
                <List
                    dataSource={recentTransactions}
                    renderItem={transaction => (
                        <List.Item className="bg-gray-700/50 p-4 rounded-xl mb-2 hover:bg-gray-600/50 transition-all duration-300 transform hover:scale-102 backdrop-blur-sm">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center">
                                    <Avatar
                                        icon={transaction.type === 'credit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                        className={`${transaction.type === 'credit' ? 'bg-green-400' : 'bg-red-400'} transform hover:scale-110 transition-transform`}
                                    />
                                    <div className="ml-4">
                                        <div className="text-blue-400">{transaction.type}</div>
                                        <div className="text-gray-400 text-sm">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </div>
                                    <Badge
                                        status={transaction.status === 'completed' ? 'success' : 'processing'}
                                        text={transaction.status}
                                    />
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Premium Banner  */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-white mb-4 md:mb-0">
                        <Title level={3} className="text-white mb-2 flex items-center">
                            <CrownOutlined className="mr-2" /> Upgrade to Premium
                        </Title>
                        <Text className="text-purple-100">
                            Get access to exclusive features and benefits
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        className="bg-white text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 rounded-lg"
                        icon={<FireOutlined />}
                    >
                        Upgrade Now
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Home; 