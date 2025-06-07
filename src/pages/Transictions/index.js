import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Progress, List, Badge, Avatar, Typography, Carousel, Tooltip, Table, Input, Select, DatePicker, Space, Tag, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, 
         TransactionOutlined, CreditCardOutlined, BankOutlined,
         BellOutlined, StarOutlined, FireOutlined, RocketOutlined,
         SafetyCertificateOutlined, TeamOutlined, ThunderboltOutlined,
         CrownOutlined, GiftOutlined, LineChartOutlined, BarChartOutlined,
         SearchOutlined, FilterOutlined, DownloadOutlined, ReloadOutlined,
         DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
         EyeOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function Transactions() {
    const user = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTransactions(user?.transactions || []);
            setLoading(false);
        }, 1000);
    }, [user]);

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'id',
            key: 'id',
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
            dataIndex: 'date',
            key: 'date',
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
                    color={type === 'credit' ? 'green' : 'red'} 
                    className="font-mono px-3 py-1 rounded-full transform hover:scale-105 transition-transform"
                >
                    {type === 'credit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} {type.toUpperCase()}
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
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchText.toLowerCase()) ||
                            transaction.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        const matchesDate = !dateRange || (
            new Date(transaction.date) >= dateRange[0].startOf('day').toDate() &&
            new Date(transaction.date) <= dateRange[1].endOf('day').toDate()
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

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={2} style={{ color: '#60A5FA' }} className="text-white mb-2 flex items-center gap-2">
                        <TransactionOutlined className="text-blue-400" /> Transactions
                    </Title>
                    <Text className="text-gray-400">Track and manage your payment history</Text>
                </div>
                <Space>
                    <Button 
                        icon={<FileExcelOutlined />}
                        className="bg-green-500 hover:bg-green-600 text-white"
                    >
                        Export Excel
                    </Button>
                    <Button 
                        icon={<FilePdfOutlined />}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Export PDF
                    </Button>
                </Space>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 flex items-center gap-2"><DollarOutlined /> Total Amount</span>}
                            value={totalAmount}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#60A5FA' }}
                        />
                        <Progress 
                            percent={Math.abs((totalAmount / 10000) * 100)} 
                            showInfo={false}
                            strokeColor="#60A5FA"
                            className="mt-2"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-400/50 hover:border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 flex items-center gap-2"><CheckCircleOutlined /> Completed</span>}
                            value={completedTransactions}
                            valueStyle={{ color: '#34D399' }}
                        />
                        <Progress 
                            percent={(completedTransactions / filteredTransactions.length) * 100} 
                            showInfo={false}
                            strokeColor="#34D399"
                            className="mt-2"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 flex items-center gap-2"><ClockCircleOutlined /> Pending</span>}
                            value={pendingTransactions}
                            valueStyle={{ color: '#FBBF24' }}
                        />
                        <Progress 
                            percent={(pendingTransactions / filteredTransactions.length) * 100} 
                            showInfo={false}
                            strokeColor="#FBBF24"
                            className="mt-2"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-red-400/50 hover:border-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm">
                        <Statistic
                            title={<span className="text-gray-300 flex items-center gap-2"><CloseCircleOutlined /> Failed</span>}
                            value={failedTransactions}
                            valueStyle={{ color: '#EF4444' }}
                        />
                        <Progress 
                            percent={(failedTransactions / filteredTransactions.length) * 100} 
                            showInfo={false}
                            strokeColor="#EF4444"
                            className="mt-2"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters and Search */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Space className="w-full md:w-auto">
                        <Input
                            placeholder="Search transactions..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full md:w-64 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Select
                            defaultValue="all"
                            style={{ width: 120 }}
                            onChange={setStatusFilter}
                            className="bg-gray-700/50"
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'failed', label: 'Failed' },
                            ]}
                        />
                        <RangePicker
                            onChange={setDateRange}
                            className="bg-gray-700/50"
                        />
                    </Space>
                    <Space>
                        <Button 
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                setSearchText('');
                                setStatusFilter('all');
                                setDateRange(null);
                                setSelectedRowKeys([]);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Reset
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Transactions Table */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm">
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    loading={loading}
                    rowKey="id"
                    rowSelection={rowSelection}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} transactions`,
                        className: "text-white"
                    }}
                    className="custom-table"
                    onRow={(record) => ({
                        onClick: () => {
                            // Handle row click
                        },
                        className: 'cursor-pointer hover:bg-gray-700/50 transition-colors'
                    })}
                />
            </Card>
        </div>
    );
}

export default Transactions;