import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Form, Input, Button, Switch, message, Divider, Select, ColorPicker, Tabs, Upload, Modal } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, SecurityScanOutlined, GlobalOutlined, 
         BgColorsOutlined, UploadOutlined, SafetyCertificateOutlined, MobileOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

function Settings() {
    const user = useSelector((state) => state.users.user);
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Here you would typically make an API call to update the settings
            console.log('Updated settings:', values);
            message.success('Settings updated successfully!');
        } catch (error) {
            message.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (file) => {
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">Settings</h2>
                
                <Tabs defaultActiveKey="1" className="custom-tabs">
                    <TabPane tab={<span><UserOutlined />Account</span>} key="1">
                        <Form
                            layout="vertical"
                            initialValues={{
                                email: user?.email,
                                notifications: true,
                                twoFactor: false,
                                language: 'en',
                                theme: 'dark',
                                accentColor: '#00FFF7',
                            }}
                            onFinish={onFinish}
                        >
                            {/* Profile Picture */}
                            <div className="mb-8">
                                <h3 className="text-xl text-cyan-300 mb-4">Profile Picture</h3>
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    onPreview={handlePreview}
                                    beforeUpload={() => false}
                                >
                                    {uploadButton}
                                </Upload>
                                <Modal
                                    visible={previewVisible}
                                    footer={null}
                                    onCancel={() => setPreviewVisible(false)}
                                >
                                    <img alt="profile" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>

                            {/* Account Settings */}
                            <div className="mb-8">
                                <h3 className="text-xl text-cyan-300 mb-4 flex items-center">
                                    <UserOutlined className="mr-2" /> Account Settings
                                </h3>
                                <Form.Item
                                    name="email"
                                    label={<span className="text-gray-300">Email Address</span>}
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input 
                                        prefix={<UserOutlined className="text-cyan-400" />}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label={<span className="text-gray-300">Phone Number</span>}
                                >
                                    <Input 
                                        prefix={<MobileOutlined className="text-cyan-400" />}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    className="bg-cyan-500 hover:bg-cyan-600 border-none h-10 px-8"
                                >
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    <TabPane tab={<span><SecurityScanOutlined />Security</span>} key="2">
                        <Form layout="vertical">
                            <div className="mb-8">
                                <h3 className="text-xl text-cyan-300 mb-4">Security Settings</h3>
                                
                                <Form.Item
                                    name="currentPassword"
                                    label={<span className="text-gray-300">Current Password</span>}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="text-cyan-400" />}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="newPassword"
                                    label={<span className="text-gray-300">New Password</span>}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="text-cyan-400" />}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label={<span className="text-gray-300">Confirm New Password</span>}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="text-cyan-400" />}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="twoFactor"
                                    label={<span className="text-gray-300">Two-Factor Authentication</span>}
                                    valuePropName="checked"
                                >
                                    <Switch className="bg-gray-700" />
                                </Form.Item>

                                <Form.Item
                                    name="loginAlerts"
                                    label={<span className="text-gray-300">Login Alerts</span>}
                                    valuePropName="checked"
                                >
                                    <Switch className="bg-gray-700" />
                                </Form.Item>

                                <Form.Item
                                    name="sessionTimeout"
                                    label={<span className="text-gray-300">Session Timeout (minutes)</span>}
                                >
                                    <Select className="bg-gray-700 border-gray-600 text-white">
                                        <Option value="15">15 minutes</Option>
                                        <Option value="30">30 minutes</Option>
                                        <Option value="60">1 hour</Option>
                                        <Option value="120">2 hours</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane tab={<span><BellOutlined />Notifications</span>} key="3">
                        <Form layout="vertical">
                            <div className="mb-8">
                                <h3 className="text-xl text-cyan-300 mb-4">Notification Preferences</h3>
                                
                                <Form.Item
                                    name="emailNotifications"
                                    label={<span className="text-gray-300">Email Notifications</span>}
                                    valuePropName="checked"
                                >
                                    <Switch className="bg-gray-700" />
                                </Form.Item>

                                <Form.Item
                                    name="transactionAlerts"
                                    label={<span className="text-gray-300">Transaction Alerts</span>}
                                    valuePropName="checked"
                                >
                                    <Switch className="bg-gray-700" />
                                </Form.Item>

                                <Form.Item
                                    name="securityAlerts"
                                    label={<span className="text-gray-300">Security Alerts</span>}
                                    valuePropName="checked"
                                >
                                    <Switch className="bg-gray-700" />
                                </Form.Item>

                                <Form.Item
                                    name="marketingEmails"
                                    label={<span className="text-gray-300">Marketing Emails</span>}
                                    valuePropName="checked"
                                >
                                    <Switch className="bg-gray-700" />
                                </Form.Item>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane tab={<span><BgColorsOutlined />Appearance</span>} key="4">
                        <Form layout="vertical">
                            <div className="mb-8">
                                <h3 className="text-xl text-cyan-300 mb-4">Theme Settings</h3>
                                
                                <Form.Item
                                    name="theme"
                                    label={<span className="text-gray-300">Theme</span>}
                                >
                                    <Select className="bg-gray-700 border-gray-600 text-white">
                                        <Option value="dark">Dark</Option>
                                        <Option value="light">Light</Option>
                                        <Option value="system">System</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="accentColor"
                                    label={<span className="text-gray-300">Accent Color</span>}
                                >
                                    <ColorPicker />
                                </Form.Item>

                                <Form.Item
                                    name="fontSize"
                                    label={<span className="text-gray-300">Font Size</span>}
                                >
                                    <Select className="bg-gray-700 border-gray-600 text-white">
                                        <Option value="small">Small</Option>
                                        <Option value="medium">Medium</Option>
                                        <Option value="large">Large</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Form>
                    </TabPane>

                    <TabPane tab={<span><GlobalOutlined />Language</span>} key="5">
                        <Form layout="vertical">
                            <div className="mb-8">
                                <h3 className="text-xl text-cyan-300 mb-4">Language & Region</h3>
                                
                                <Form.Item
                                    name="language"
                                    label={<span className="text-gray-300">Language</span>}
                                >
                                    <Select className="bg-gray-700 border-gray-600 text-white">
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
                                    <Select className="bg-gray-700 border-gray-600 text-white">
                                        <Option value="utc">UTC</Option>
                                        <Option value="est">EST</Option>
                                        <Option value="pst">PST</Option>
                                        <Option value="gmt">GMT</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="dateFormat"
                                    label={<span className="text-gray-300">Date Format</span>}
                                >
                                    <Select className="bg-gray-700 border-gray-600 text-white">
                                        <Option value="mm/dd/yyyy">MM/DD/YYYY</Option>
                                        <Option value="dd/mm/yyyy">DD/MM/YYYY</Option>
                                        <Option value="yyyy-mm-dd">YYYY-MM-DD</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default Settings; 