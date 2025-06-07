import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Home() {
  const user = useSelector((state) => state.users.user);
  const [stats, setStats] = useState({
    balance: 0,
    totalSent: 0,
    totalReceived: 0
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600">Here's your payment dashboard</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Current Balance"
              value={stats.balance}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Sent"
              value={stats.totalSent}
              precision={2}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Received"
              value={stats.totalReceived}
              precision={2}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="text-center"
              onClick={() => window.location.href = '/transactions'}
            >
              <DollarOutlined className="text-4xl text-blue-500" />
              <h3 className="mt-4 text-lg font-semibold">Send Money</h3>
              <p className="text-gray-600">Transfer money to other users</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="text-center"
              onClick={() => window.location.href = '/profile'}
            >
              <DollarOutlined className="text-4xl text-green-500" />
              <h3 className="mt-4 text-lg font-semibold">View Profile</h3>
              <p className="text-gray-600">Update your account details</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="text-center"
              onClick={() => window.location.href = '/transactions'}
            >
              <DollarOutlined className="text-4xl text-purple-500" />
              <h3 className="mt-4 text-lg font-semibold">Transaction History</h3>
              <p className="text-gray-600">View your past transactions</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home; 