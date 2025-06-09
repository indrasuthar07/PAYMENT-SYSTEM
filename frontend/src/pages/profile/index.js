import React, { useState } from 'react';
import { Card, Avatar, Button, Row, Col, Statistic, Progress, Tabs, List, Badge, Divider, message, Typography } from 'antd';
import { UserOutlined, WalletOutlined, TransactionOutlined, LogoutOutlined, 
         CreditCardOutlined, BankOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetUser } from '../../redux/UserSlice';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function Profile() {
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(SetUser(null));
        message.success('Logged out successfully');
        navigate('/signin');
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
                    <Title level={4} style={{ color: 'white' }}>Please sign in to view your profile</Title>
                <Button type="primary" onClick={() => navigate('/signin')}>
                        Sign In
                </Button>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ background: '#C0C0C0', minHeight: '100vh' }} className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
            {/* Welcome Section */}
            <Card style={{ background: '#2563eb', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,58,138,0.08)' }} className="border-none backdrop-blur-lg bg-opacity-90 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <Title level={2} style={{ color: 'white', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }} className="animate-fade-in">
                            Profile Overview
                        </Title>
                        <Text style={{ color: 'white', fontSize: 18, opacity: 0.95 }}>
                            Manage your account settings and preferences
                        </Text>
                    </div>
                    <Button 
                        type="primary" 
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ background: 'white', color: '#2563eb', border: 'none', borderRadius: 8, fontWeight: 600, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}
                        className="hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
                    >
                        Logout
                    </Button>
                </div>
            </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Info Card */}
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col items-center">
                            <Avatar 
                                size={120} 
                                icon={<UserOutlined />} 
                            className="bg-blue-500 mb-4"
                            />
                        <Title level={3} className="text-gray-800 mb-2">
                                {user?.firstName} {user?.lastName}
                        </Title>
                        <Text className="text-gray-600 mb-4">{user?.email}</Text>
                        <Text className="text-gray-600 mb-4"> AC. NO. :{user?.id}</Text>
                            <Badge 
                                status="success" 
                            text={<span className="text-green-500">Active Account</span>} 
                            />
                        </div>
                    </Card>

                    {/* Stats Card */}
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <Title level={4} className="text-gray-800 mb-4">Account Statistics</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic 
                                title={<span className="text-gray-600">Balance</span>}
                                    value={user?.balance || 0}
                                    precision={2}
                                    prefix="$"
                                valueStyle={{ color: '#2563eb' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic 
                                title={<span className="text-gray-600">Transactions</span>}
                                    value={user?.transactions?.length || 0}
                                valueStyle={{ color: '#2563eb' }}
                                />
                            </Col>
                        </Row>
                    <Divider className="border-gray-200" />
                        <div className="mt-4">
                        <Text className="text-gray-600 mb-2">Account Level</Text>
                            <Progress 
                                percent={75} 
                            strokeColor="#2563eb"
                            trailColor="#E5E7EB"
                                showInfo={false}
                            />
                        <Text className="text-gray-500 text-sm mt-2">Premium Account</Text>
                        </div>
                    </Card>

                    {/* Quick Actions Card */}
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <Title level={4} className="text-gray-800 mb-4">Quick Actions</Title>
                        <List
                            dataSource={[
                            { icon: <WalletOutlined />, text: 'Add Money', color: 'text-green-500' },
                            { icon: <TransactionOutlined />, text: 'Send Money', color: 'text-blue-500' },
                            { icon: <CreditCardOutlined />, text: 'Link Card', color: 'text-purple-500' },
                            { icon: <BankOutlined />, text: 'Link Bank', color: 'text-yellow-500' },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <Button 
                                        type="text" 
                                    className={`flex items-center gap-2 ${item.color} hover:bg-gray-50 w-full text-left`}
                                    >
                                        {item.icon} {item.text}
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>

            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <Tabs 
                    defaultActiveKey="1" 
                    className="custom-tabs"
                    onChange={setActiveTab}
                    tabBarStyle={{ color: '#2563eb' }}
                >
                    <TabPane 
                        tab={
                            <span className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-500">
                                <HistoryOutlined className="text-xl" />
                                Recent Transactions
                            </span>
                        } 
                        key="1"
                    >
                        <List
                            dataSource={user?.transactions || []}
                            renderItem={transaction => (
                                <List.Item className="bg-gray-50 p-4 rounded-lg mb-2 hover:bg-gray-100 transition-all duration-300">
                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <Title level={5} className="text-gray-800">{transaction.type}</Title>
                                            <Text className="text-gray-500">{new Date(transaction.date).toLocaleDateString()}</Text>
                                        </div>
                                        <div className="text-right">
                                            <Text className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${Math.abs(transaction.amount).toFixed(2)}
                                            </Text>
                                            <Badge 
                                                status={transaction.status === 'completed' ? 'success' : 'processing'} 
                                                text={transaction.status}
                                            />
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </TabPane>

                    <TabPane 
                        tab={
                            <span className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-500">
                                <SettingOutlined className="text-xl" />
                                Account Settings
                            </span>
                        } 
                        key="2"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gray-50 border-none">
                                <Title level={4} className="text-gray-800 mb-4">Security Settings</Title>
                                <List
                                    dataSource={[
                                        { title: 'Two-Factor Authentication', status: 'Disabled' },
                                        { title: 'Login Notifications', status: 'Enabled' },
                                        { title: 'Transaction PIN', status: 'Set' },
                                    ]}
                                    renderItem={item => (
                                        <List.Item className="flex justify-between items-center">
                                            <Text className="text-gray-600">{item.title}</Text>
                                            <Badge 
                                                status={item.status === 'Enabled' || item.status === 'Set' ? 'success' : 'default'} 
                                                text={item.status}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default Profile; 