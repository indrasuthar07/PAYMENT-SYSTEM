import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Divider, Button, Timeline, Statistic, Progress, Tabs, Tag, Switch, Modal } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, 
         DollarOutlined, SafetyCertificateOutlined, HistoryOutlined, 
         ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined,
         QrcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function Profile() {
    const user = useSelector((state) => state.users.user);
    const [activityHistory, setActivityHistory] = useState([]);
    const [stats, setStats] = useState({
        totalTransactions: 0,
        successRate: 0,
        averageAmount: 0,
        monthlyGrowth: 0
    });
    const [isQrModalVisible, setIsQrModalVisible] = useState(false);

    useEffect(() => {
        // Simulated activity history
        setActivityHistory([
            { type: 'login', time: '2024-03-15 10:30', status: 'success' },
            { type: 'transaction', time: '2024-03-14 15:45', amount: 500, status: 'success' },
            { type: 'password_change', time: '2024-03-10 09:15', status: 'success' },
            { type: 'transaction', time: '2024-03-08 14:20', amount: 1000, status: 'success' },
            { type: 'login', time: '2024-03-05 11:00', status: 'failed' }
        ]);

        // Simulated stats
        setStats({
            totalTransactions: 156,
            successRate: 98.5,
            averageAmount: 750,
            monthlyGrowth: 12.5
        });
    }, []);

    const getActivityIcon = (type) => {
        switch(type) {
            case 'login': return <UserOutlined />;
            case 'transaction': return <DollarOutlined />;
            case 'password_change': return <SafetyCertificateOutlined />;
            default: return <HistoryOutlined />;
        }
    };

    const getStatusColor = (status) => {
        return status === 'success' ? 'green' : 'red';
    };

    const handleDownloadQR = () => {
        const canvas = document.getElementById('qr-code');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `profile-qr-${user?.firstName}-${user?.lastName}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const qrValue = JSON.stringify({
        id: user?.id,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        phone: user?.phone,
        timestamp: new Date().toISOString()
    });

    return (
        <div className="space-y-6">
            <Row gutter={[24, 24]}>
                {/* Profile Overview */}
                <Col xs={24} lg={8}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500 h-full">
                        <div className="text-center mb-8">
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-cyan-500 flex items-center justify-center">
                                <UserOutlined className="text-6xl text-white" />
                            </div>
                            <Title level={2} className="text-cyan-400 mb-2">
                                {user?.firstName} {user?.lastName}
                            </Title>
                            <Text className="text-gray-400">Member since {new Date(user?.createdAt).toLocaleDateString()}</Text>
                            <div className="mt-4">
                                <Tag color="cyan" className="text-sm">Verified User</Tag>
                                <Tag color="blue" className="text-sm">Premium</Tag>
                            </div>
                        </div>

                        <Divider className="border-cyan-700" />

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <MailOutlined className="text-cyan-400 text-xl mr-3" />
                                <Text className="text-gray-300">{user?.email}</Text>
                            </div>
                            <div className="flex items-center">
                                <PhoneOutlined className="text-cyan-400 text-xl mr-3" />
                                <Text className="text-gray-300">{user?.mobileNo}</Text>
                            </div>
                            <div className="flex items-center">
                                <CalendarOutlined className="text-cyan-400 text-xl mr-3" />
                                <Text className="text-gray-300">
                                    {new Date(user?.dateOfBirth).toLocaleDateString()}
                                </Text>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button type="primary" block className="bg-cyan-500 hover:bg-cyan-600 border-none">
                                Edit Profile
                            </Button>
                        </div>
                    </Card>
                </Col>

                {/* Account Statistics and Activity */}
                <Col xs={24} lg={16}>
                    <Tabs defaultActiveKey="1" className="custom-tabs">
                        <TabPane tab={<span><DollarOutlined />Account Overview</span>} key="1">
                            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} sm={12}>
                                        <Card className="bg-gray-800 border-cyan-700">
                                            <Statistic
                                                title={<span className="text-gray-300">Total Transactions</span>}
                                                value={stats.totalTransactions}
                                                prefix={<DollarOutlined className="text-cyan-400" />}
                                                valueStyle={{ color: '#00FFF7' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Card className="bg-gray-800 border-cyan-700">
                                            <Statistic
                                                title={<span className="text-gray-300">Success Rate</span>}
                                                value={stats.successRate}
                                                suffix="%"
                                                valueStyle={{ color: '#00FFF7' }}
                                            />
                                            <Progress percent={stats.successRate} showInfo={false} strokeColor="#00FFF7" />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Card className="bg-gray-800 border-cyan-700">
                                            <Statistic
                                                title={<span className="text-gray-300">Average Amount</span>}
                                                value={stats.averageAmount}
                                                prefix="$"
                                                valueStyle={{ color: '#00FFF7' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Card className="bg-gray-800 border-cyan-700">
                                            <Statistic
                                                title={<span className="text-gray-300">Monthly Growth</span>}
                                                value={stats.monthlyGrowth}
                                                suffix="%"
                                                valueStyle={{ color: '#00FFF7' }}
                                                prefix={stats.monthlyGrowth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </TabPane>

                        <TabPane tab={<span><HistoryOutlined />Activity History</span>} key="2">
                            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                                <Timeline>
                                    {activityHistory.map((activity, index) => (
                                        <Timeline.Item 
                                            key={index}
                                            color={getStatusColor(activity.status)}
                                            dot={getActivityIcon(activity.type)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <Text className="text-gray-300 capitalize">{activity.type.replace('_', ' ')}</Text>
                                                    <br />
                                                    <Text className="text-gray-500 text-sm">{activity.time}</Text>
                                                </div>
                                                {activity.amount && (
                                                    <Text className="text-cyan-400">${activity.amount}</Text>
                                                )}
                                                <Tag color={getStatusColor(activity.status)}>
                                                    {activity.status === 'success' ? <CheckCircleOutlined /> : 'Failed'}
                                                </Tag>
                                            </div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>
                        </TabPane>

                        <TabPane tab={<span><SafetyCertificateOutlined />Security Status</span>} key="3">
                            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Text className="text-gray-300">Two-Factor Authentication</Text>
                                            <br />
                                            <Text className="text-gray-500 text-sm">Add an extra layer of security</Text>
                                        </div>
                                        <Switch defaultChecked={false} />
                                    </div>
                                    <Divider className="border-cyan-700" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Text className="text-gray-300">Login Notifications</Text>
                                            <br />
                                            <Text className="text-gray-500 text-sm">Get notified of new logins</Text>
                                        </div>
                                        <Switch defaultChecked={true} />
                                    </div>
                                    <Divider className="border-cyan-700" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Text className="text-gray-300">Last Password Change</Text>
                                            <br />
                                            <Text className="text-gray-500 text-sm">March 10, 2024</Text>
                                        </div>
                                        <Button type="primary" className="bg-cyan-500 hover:bg-cyan-600 border-none">
                                            Change Password
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>

            {/* Add QR Code Card */}
            <Card className="bg-gray-800 border-cyan-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-cyan-400">
                        <QrcodeOutlined className="mr-2" />
                        Profile QR Code
                    </h3>
                    <Button 
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => setIsQrModalVisible(true)}
                        className="bg-cyan-600 hover:bg-cyan-500"
                    >
                        View QR Code
                    </Button>
                </div>
                <p className="text-gray-400 mb-4">
                    Share your profile QR code with others for quick access to your payment profile.
                </p>
            </Card>

            {/* QR Code Modal */}
            <Modal
                title="Profile QR Code"
                open={isQrModalVisible}
                onCancel={() => setIsQrModalVisible(false)}
                footer={[
                    <Button key="download" type="primary" onClick={handleDownloadQR} className="bg-cyan-600 hover:bg-cyan-500">
                        <DownloadOutlined /> Download QR Code
                    </Button>,
                    <Button key="close" onClick={() => setIsQrModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                <div className="flex flex-col items-center justify-center p-6">
                    <div className="bg-white p-4 rounded-lg mb-4">
                        <QRCodeCanvas
                            id="qr-code"
                            value={qrValue}
                            size={256}
                            level="H"
                            includeMargin={true}
                            className="mx-auto"
                        />
                    </div>
                    <p className="text-gray-400 text-center">
                        Scan this QR code to access {user?.firstName}'s payment profile
                    </p>
                </div>
            </Modal>
        </div>
    );
}

export default Profile; 