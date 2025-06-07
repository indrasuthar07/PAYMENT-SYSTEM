import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Switch, Select, Button, Upload, message, Divider, Row, Col, Tooltip, Badge } from 'antd';
import { UserOutlined, BellOutlined, LockOutlined, GlobalOutlined, 
         UploadOutlined, SafetyCertificateOutlined, QrcodeOutlined,
         CreditCardOutlined, BankOutlined, WalletOutlined, SettingOutlined, PhoneOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { SetUser } from '../../redux/userSlice';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

function Settings() {
    const user = useSelector((state) => state.users.user);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(SetUser(response.data));
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            message.error('Failed to load user profile');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/api/users/profile', values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(SetUser(response.data.user));
            message.success('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Card className="bg-gray-800 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                        <SettingOutlined className="text-4xl" />
                        Settings
                    </h2>
                    <Badge count="New" className="bg-blue-400">
                        <span className="text-gray-300">Advanced Features</span>
                    </Badge>
                </div>
                
                <Tabs 
                    defaultActiveKey="1" 
                    className="custom-tabs"
                    onChange={setActiveTab}
                    tabBarStyle={{ color: '#60A5FA' }}
                >
                    <TabPane 
                        tab={
                            <span className="flex items-center gap-2 text-lg">
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
                                    <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                                        <h3 className="text-xl text-blue-400 mb-4">Profile Information</h3>
                                        <Form.Item
                                            name="email"
                                            label={<span className="text-gray-300">Email Address</span>}
                                            rules={[{ required: true, type: 'email' }]}
                                        >
                                            <Input 
                                                prefix={<UserOutlined className="text-blue-400" />}
                                                className="bg-gray-600 border-gray-500 text-white"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="mobileNo"
                                            label={<span className="text-gray-300">Phone Number</span>}
                                            rules={[
                                                { required: true, message: 'Please input your phone number!' },
                                                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<PhoneOutlined className="text-blue-400" />}
                                                className="bg-gray-600 border-gray-500 text-white"
                                            />
                                        </Form.Item>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                                        <h3 className="text-xl text-blue-400 mb-4">Profile Picture</h3>
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-full bg-blue-400/20 flex items-center justify-center mb-4">
                                                <UserOutlined className="text-6xl text-blue-400" />
                                            </div>
                                            <Upload>
                                                <Button 
                                                    icon={<UploadOutlined />}
                                                    className="bg-blue-400 hover:bg-blue-500 text-white border-none"
                                                >
                                                    Upload Photo
                                                </Button>
                                            </Upload>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                                <h3 className="text-xl text-blue-400 mb-4">Security Settings</h3>
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="twoFactor"
                                            label={<span className="text-gray-300">Two-Factor Authentication</span>}
                                            valuePropName="checked"
                                        >
                                            <Switch className="bg-gray-600" />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            label={<span className="text-gray-300">Change Password</span>}
                                        >
                                            <Input.Password 
                                                prefix={<LockOutlined className="text-blue-400" />}
                                                className="bg-gray-600 border-gray-500 text-white"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="p-4 bg-gray-600 rounded-lg">
                                            <h4 className="text-blue-400 mb-2">QR Code for 2FA</h4>
                                            <div className="flex justify-center">
                                                <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center">
                                                    <QrcodeOutlined className="text-6xl text-gray-400" />
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm text-center mt-2">
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
                            <span className="flex items-center gap-2 text-lg">
                                <BellOutlined className="text-xl" />
                                Notifications
                            </span>
                        } 
                        key="2"
                    >
                        <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                            <Form layout="vertical">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="bg-gray-600 border-blue-400/50">
                                            <h3 className="text-lg text-blue-400 mb-4">Email Notifications</h3>
                                            <Form.Item
                                                name="emailNotifications"
                                                label={<span className="text-gray-300">Transaction Alerts</span>}
                                                valuePropName="checked"
                                            >
                                                <Switch className="bg-gray-500" />
                                            </Form.Item>
                                            <Form.Item
                                                name="securityAlerts"
                                                label={<span className="text-gray-300">Security Alerts</span>}
                                                valuePropName="checked"
                                            >
                                                <Switch className="bg-gray-500" />
                                            </Form.Item>
                                        </Card>

                                        <Card className="bg-gray-600 border-blue-400/50">
                                            <h3 className="text-lg text-blue-400 mb-4">Push Notifications</h3>
                                            <Form.Item
                                                name="pushNotifications"
                                                label={<span className="text-gray-300">Enable Push Notifications</span>}
                                                valuePropName="checked"
                                            >
                                                <Switch className="bg-gray-500" />
                                            </Form.Item>
                                            <Form.Item
                                                name="marketingNotifications"
                                                label={<span className="text-gray-300">Marketing Updates</span>}
                                                valuePropName="checked"
                                            >
                                                <Switch className="bg-gray-500" />
                                            </Form.Item>
                                        </Card>
                                    </div>
                                </div>
                            </Form>
                        </Card>
                    </TabPane>

                    <TabPane 
                        tab={
                            <span className="flex items-center gap-2 text-lg">
                                <GlobalOutlined className="text-xl" />
                                Preferences
                            </span>
                        } 
                        key="3"
                    >
                        <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                            <Form layout="vertical">
                                <div className="space-y-6">
                                    <Row gutter={[24, 24]}>
                                        <Col xs={24} md={12}>
                                            <Card className="bg-gray-600 border-blue-400/50">
                                                <h3 className="text-lg text-blue-400 mb-4">Language & Region</h3>
                                                <Form.Item
                                                    name="language"
                                                    label={<span className="text-gray-300">Language</span>}
                                                >
                                                    <Select className="bg-gray-500 border-gray-400 text-white">
                                                        <Option value="en">English</Option>
                                                        <Option value="es">Spanish</Option>
                                                        <Option value="fr">French</Option>
                                                        <Option value="de">German</Option>
                                                        <Option value="zh">Chinese</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    name="timezone"
                                                    label={<span className="text-gray-300">Timezone</span>}
                                                >
                                                    <Select className="bg-gray-500 border-gray-400 text-white">
                                                        <Option value="utc">UTC</Option>
                                                        <Option value="est">EST</Option>
                                                        <Option value="pst">PST</Option>
                                                        <Option value="gmt">GMT</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Card className="bg-gray-600 border-blue-400/50">
                                                <h3 className="text-lg text-blue-400 mb-4">Display Settings</h3>
                                                <Form.Item
                                                    name="theme"
                                                    label={<span className="text-gray-300">Theme</span>}
                                                >
                                                    <Select className="bg-gray-500 border-gray-400 text-white">
                                                        <Option value="dark">Dark</Option>
                                                        <Option value="light">Light</Option>
                                                        <Option value="system">System</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    name="accentColor"
                                                    label={<span className="text-gray-300">Accent Color</span>}
                                                >
                                                    <Select className="bg-gray-500 border-gray-400 text-white">
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
                            <span className="flex items-center gap-2 text-lg">
                                <CreditCardOutlined className="text-xl" />
                                Payment Methods
                            </span>
                        } 
                        key="4"
                    >
                        <Card className="bg-gray-700 border-blue-400 hover:border-blue-300 transition-all duration-300">
                            <div className="space-y-6">
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} md={12}>
                                        <Card className="bg-gray-600 border-blue-400/50 hover:border-blue-400 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <CreditCardOutlined className="text-2xl text-blue-400" />
                                                <h3 className="text-lg text-blue-400">Credit Cards</h3>
                                            </div>
                                            <Button 
                                                type="primary" 
                                                className="bg-blue-400 hover:bg-blue-500 text-white border-none w-full"
                                            >
                                                Add New Card
                                            </Button>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Card className="bg-gray-600 border-blue-400/50 hover:border-blue-400 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <BankOutlined className="text-2xl text-blue-400" />
                                                <h3 className="text-lg text-blue-400">Bank Accounts</h3>
                                            </div>
                                            <Button 
                                                type="primary" 
                                                className="bg-blue-400 hover:bg-blue-500 text-white border-none w-full"
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
                        className="bg-blue-400 hover:bg-blue-500 text-white border-none px-8 py-2 text-lg"
                        loading={loading}
                        onClick={() => onFinish()}
                    >
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Settings; 