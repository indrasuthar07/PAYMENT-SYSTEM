import React, { useState } from 'react';
import { Card, Avatar, Button, Row, Col, Statistic, Progress, Tabs, List, Badge, Divider, message } from 'antd';
import { UserOutlined, WalletOutlined, TransactionOutlined, LogoutOutlined, 
         CreditCardOutlined, BankOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetUser } from '../../redux/userSlice';

const { TabPane } = Tabs;

function Profile() {
    const user = useSelector((state) => state.users.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(SetUser(null));
        message.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Card className="bg-gray-800 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                        <UserOutlined className="text-4xl" />
                        Profile
                    </h2>
                    <Button 
                        type="primary" 
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                    >
                        Logout
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Info Card */}
                    <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                        <div className="flex flex-col items-center">
                            <Avatar 
                                size={120} 
                                icon={<UserOutlined />} 
                                className="bg-blue-400 mb-4"
                            />
                            <h3 className="text-2xl font-bold text-blue-400 mb-2">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-gray-300 mb-4">{user?.email}</p>
                            <Badge 
                                status="success" 
                                text={<span className="text-green-400">Active Account</span>} 
                            />
                        </div>
                    </Card>

                    {/* Stats Card */}
                    <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                        <h3 className="text-xl text-blue-400 mb-4">Account Statistics</h3>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic 
                                    title={<span className="text-gray-300">Balance</span>}
                                    value={user?.balance || 0}
                                    precision={2}
                                    prefix="$"
                                    valueStyle={{ color: '#60A5FA' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic 
                                    title={<span className="text-gray-300">Transactions</span>}
                                    value={user?.transactions?.length || 0}
                                    valueStyle={{ color: '#60A5FA' }}
                                />
                            </Col>
                        </Row>
                        <Divider className="border-gray-600" />
                        <div className="mt-4">
                            <h4 className="text-gray-300 mb-2">Account Level</h4>
                            <Progress 
                                percent={75} 
                                strokeColor="#60A5FA"
                                trailColor="#4B5563"
                                showInfo={false}
                            />
                            <p className="text-gray-400 text-sm mt-2">Premium Account</p>
                        </div>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                        <h3 className="text-xl text-blue-400 mb-4">Quick Actions</h3>
                        <List
                            dataSource={[
                                { icon: <WalletOutlined />, text: 'Add Money', color: 'text-green-400' },
                                { icon: <TransactionOutlined />, text: 'Send Money', color: 'text-blue-400' },
                                { icon: <CreditCardOutlined />, text: 'Link Card', color: 'text-purple-400' },
                                { icon: <BankOutlined />, text: 'Link Bank', color: 'text-yellow-400' },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <Button 
                                        type="text" 
                                        className={`flex items-center gap-2 ${item.color} hover:bg-gray-600 w-full text-left`}
                                    >
                                        {item.icon} {item.text}
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>

                <Tabs 
                    defaultActiveKey="1" 
                    className="mt-6 custom-tabs"
                    onChange={setActiveTab}
                    tabBarStyle={{ color: '#60A5FA' }}
                >
                    <TabPane 
                        tab={
                            <span className="flex items-center gap-2 text-lg">
                                <HistoryOutlined className="text-xl" />
                                Recent Transactions
                            </span>
                        } 
                        key="1"
                    >
                        <List
                            dataSource={user?.transactions || []}
                            renderItem={transaction => (
                                <List.Item className="bg-gray-700 p-4 rounded-lg mb-2 hover:bg-gray-600 transition-all duration-300">
                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <h4 className="text-blue-400">{transaction.type}</h4>
                                            <p className="text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ${Math.abs(transaction.amount).toFixed(2)}
                                            </p>
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
                            <span className="flex items-center gap-2 text-lg">
                                <SettingOutlined className="text-xl" />
                                Account Settings
                            </span>
                        } 
                        key="2"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gray-700 border-blue-400">
                                <h3 className="text-xl text-blue-400 mb-4">Security Settings</h3>
                                <List
                                    dataSource={[
                                        { title: 'Two-Factor Authentication', status: 'Disabled' },
                                        { title: 'Login Notifications', status: 'Enabled' },
                                        { title: 'Transaction PIN', status: 'Set' },
                                    ]}
                                    renderItem={item => (
                                        <List.Item className="flex justify-between items-center">
                                            <span className="text-gray-300">{item.title}</span>
                                            <Badge 
                                                status={item.status === 'Enabled' || item.status === 'Set' ? 'success' : 'default'} 
                                                text={item.status}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>

                            <Card className="bg-gray-700 border-blue-400">
                                <h3 className="text-xl text-blue-400 mb-4">Linked Accounts</h3>
                                <List
                                    dataSource={[
                                        { title: 'Primary Bank Account', status: 'Linked' },
                                        { title: 'Credit Card', status: 'Not Linked' },
                                        { title: 'PayPal', status: 'Not Linked' },
                                    ]}
                                    renderItem={item => (
                                        <List.Item className="flex justify-between items-center">
                                            <span className="text-gray-300">{item.title}</span>
                                            <Badge 
                                                status={item.status === 'Linked' ? 'success' : 'default'} 
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