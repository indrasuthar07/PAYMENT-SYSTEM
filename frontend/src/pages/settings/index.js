import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Switch, Select, Button, Upload, message, Divider, Row, Col, Tooltip, Badge } from 'antd';
import { UserOutlined, BellOutlined, LockOutlined, GlobalOutlined, 
         UploadOutlined, SafetyCertificateOutlined, QrcodeOutlined,
         CreditCardOutlined, BankOutlined, WalletOutlined, SettingOutlined, PhoneOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Option } = Select;

function Settings() {
    const { user, loading: authLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            return;
        }
        fetchUserProfile();
    }, [user, navigate]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(SetUser(response.data));
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            message.error('Failed to load user profile');
            if (error.response?.status === 401) {
                navigate('/signin');
            }
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }
            const response = await axios.put('http://localhost:5000/api/users/profile', values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(SetUser(response.data.user));
            message.success('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error('Failed to update settings');
            if (error.response?.status === 401) {
                navigate('/signin');
            }
        } finally {
            setLoading(false);
        }
    };

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
                <h2 className="text-2xl text-red-500 mb-4">Please sign in to access settings</h2>
                <Button type="primary" onClick={() => navigate('/signin')}>
                    Go to Sign In
                </Button>
            </div>
        );
    }

    return (
        <div style={{ background: '#C0C0C0', minHeight: '100vh' }} className="max-w-6xl mx-auto py-8 px-4 md:px-8 space-y-8">
            <Card style={{ background: '#2563eb', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,58,138,0.08)' }} className="border-none backdrop-blur-lg bg-opacity-90 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <SettingOutlined className="text-4xl" />
                        Settings
                    </h2>
                    
                </div>
            </Card>
                
            <Tabs 
                defaultActiveKey="1" 
                className="custom-tabs"
                onChange={setActiveTab}
                tabBarStyle={{ color: '#2563eb' }}
            >
                <TabPane 
                    tab={
                        <span className="flex text-gray-700 hover:text-blue-600 items-center gap-2 text-lg">
                            <UserOutlined className="text-xl" />
                            Account
                        </span>
                    } 
                    key="1"
                >
                    <Form
                        layout="vertical"
                        initialValues={{
                            email: user?.email,
                            mobileNo: user?.mobileNo,
                            notifications: true,
                            twoFactor: false,
                            language: 'en',
                            theme: 'dark',
                            accentColor: '#00FFF7',
                        }}
                        onFinish={onFinish}
                        className="space-y-6"
                    >
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                                    <h3 className="text-xl text-blue-600 mb-4">Profile Information</h3>
                                    <Form.Item
                                        name="email"
                                        label={<span className="text-gray-700">Email Address</span>}
                                        rules={[{ required: true, type: 'email' }]}
                                    >
                                        <Input 
                                            prefix={<UserOutlined className="text-blue-600" />}
                                            className="hover:border-blue-400 focus:border-blue-400"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="mobileNo"
                                        label={<span className="text-gray-700">Phone Number</span>}
                                        rules={[
                                            { required: true, message: 'Please input your phone number!' },
                                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                                        ]}
                                    >
                                        <Input 
                                            prefix={<PhoneOutlined className="text-blue-600" />}
                                            className="hover:border-blue-400 focus:border-blue-400"
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                                    <h3 className="text-xl text-blue-600 mb-4">Profile Picture</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                            <UserOutlined className="text-6xl text-blue-600" />
                                        </div>
                                        <Upload>
                                            <Button 
                                                icon={<UploadOutlined />}
                                                className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                                            >
                                                Upload Photo
                                            </Button>
                                        </Upload>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <h3 className="text-xl text-blue-600 mb-4">Security Settings</h3>
                            <Row gutter={[24, 24]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="twoFactor"
                                        label={<span className="text-gray-700">Two-Factor Authentication</span>}
                                        valuePropName="checked"
                                    >
                                        <Switch className="bg-gray-200" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label={<span className="text-gray-700">Change Password</span>}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined className="text-blue-600" />}
                                            className="hover:border-blue-400 focus:border-blue-400"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h4 className="text-blue-600 mb-2">QR Code for 2FA</h4>
                                        <div className="flex justify-center">
                                            <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center">
                                                <QrcodeOutlined className="text-6xl text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm text-center mt-2">
                                            Scan this code with your authenticator app
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </TabPane>

                <TabPane 
                    tab={
                        <span className="flex text-gray-700 hover:text-blue-600 items-center gap-2 text-lg">
                            <BellOutlined className="text-xl" />
                            Notifications
                        </span>
                    } 
                    key="2"
                >
                    <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <Form layout="vertical">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card style={{ background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 className="text-lg text-blue-600 mb-4">Email Notifications</h3>
                                        <Form.Item
                                            name="emailNotifications"
                                            label={<span className="text-gray-700">Transaction Alerts</span>}
                                            valuePropName="checked"
                                        >
                                            <Switch className="bg-gray-200" />
                                        </Form.Item>
                                        <Form.Item
                                            name="securityAlerts"
                                            label={<span className="text-gray-700">Security Alerts</span>}
                                            valuePropName="checked"
                                        >
                                            <Switch className="bg-gray-200" />
                                        </Form.Item>
                                    </Card>

                                    <Card style={{ background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 className="text-lg text-blue-600 mb-4">Push Notifications</h3>
                                        <Form.Item
                                            name="pushNotifications"
                                            label={<span className="text-gray-700">Enable Push Notifications</span>}
                                            valuePropName="checked"
                                        >
                                            <Switch className="bg-gray-200" />
                                        </Form.Item>
                                        <Form.Item
                                            name="marketingNotifications"
                                            label={<span className="text-gray-700">Marketing Updates</span>}
                                            valuePropName="checked"
                                        >
                                            <Switch className="bg-gray-200" />
                                        </Form.Item>
                                    </Card>
                                </div>
                            </div>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane 
                    tab={
                        <span className="flex text-gray-700 hover:text-blue-600 items-center gap-2 text-lg">
                            <GlobalOutlined className="text-xl" />
                            Preferences
                        </span>
                    } 
                    key="3"
                >
                    <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <Form layout="vertical">
                            <div className="space-y-6">
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} md={12}>
                                        <Card style={{ background: '#f8fafc', borderRadius: 12 }}>
                                            <h3 className="text-lg text-blue-600 mb-4">Language & Region</h3>
                                            <Form.Item
                                                name="language"
                                                label={<span className="text-gray-700">Language</span>}
                                            >
                                                <Select className="hover:border-blue-400 focus:border-blue-400">
                                                    <Option value="en">English</Option>
                                                    <Option value="es">Spanish</Option>
                                                    <Option value="fr">French</Option>
                                                    <Option value="de">German</Option>
                                                    <Option value="zh">Chinese</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="timezone"
                                                label={<span className="text-gray-700">Timezone</span>}
                                            >
                                                <Select className="hover:border-blue-400 focus:border-blue-400">
                                                    <Option value="utc">UTC</Option>
                                                    <Option value="est">EST</Option>
                                                    <Option value="pst">PST</Option>
                                                    <Option value="gmt">GMT</Option>
                                                </Select>
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Card style={{ background: '#f8fafc', borderRadius: 12 }}>
                                            <h3 className="text-lg text-blue-600 mb-4">Display Settings</h3>
                                            <Form.Item
                                                name="theme"
                                                label={<span className="text-gray-700">Theme</span>}
                                            >
                                                <Select className="hover:border-blue-400 focus:border-blue-400">
                                                    <Option value="dark">Dark</Option>
                                                    <Option value="light">Light</Option>
                                                    <Option value="system">System</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name="accentColor"
                                                label={<span className="text-gray-700">Accent Color</span>}
                                            >
                                                <Select className="hover:border-blue-400 focus:border-blue-400">
                                                    <Option value="#00FFF7">Cyan</Option>
                                                    <Option value="#60A5FA">Blue</Option>
                                                    <Option value="#34D399">Green</Option>
                                                    <Option value="#F472B6">Pink</Option>
                                                </Select>
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane 
                    tab={
                        <span className="flex text-gray-700 hover:text-blue-600 items-center gap-2 text-lg">
                            <CreditCardOutlined className="text-xl" />
                            Payment Methods
                        </span>
                    } 
                    key="4"
                >
                    <Card style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <div className="space-y-6">
                            <Row gutter={[24, 24]}>
                                <Col xs={24} md={12}>
                                    <Card style={{ background: '#f8fafc', borderRadius: 12 }}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <CreditCardOutlined className="text-2xl text-blue-600" />
                                            <h3 className="text-lg text-blue-600">Credit Cards</h3>
                                        </div>
                                        <Button 
                                            type="primary" 
                                            className="bg-blue-600 hover:bg-blue-700 text-white border-none w-full"
                                        >
                                            Add New Card
                                        </Button>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card style={{ background: '#f8fafc', borderRadius: 12 }}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <BankOutlined className="text-2xl text-blue-600" />
                                            <h3 className="text-lg text-blue-600">Bank Accounts</h3>
                                        </div>
                                        <Button 
                                            type="primary" 
                                            className="bg-blue-600 hover:bg-blue-700 text-white border-none w-full"
                                        >
                                            Link Bank Account
                                        </Button>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </TabPane>
            </Tabs>

            <div className="mt-6 flex justify-end">
                <Button 
                    type="primary" 
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none px-8 py-2 text-lg"
                    loading={loading}
                    onClick={() => onFinish()}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

export default Settings; 