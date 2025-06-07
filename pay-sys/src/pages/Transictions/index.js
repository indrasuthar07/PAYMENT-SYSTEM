import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Table, Input, Button, Select, DatePicker, Tag, Modal, Descriptions, 
         Statistic, Row, Col, Space, Tooltip, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, 
         ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, 
         DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Transactions() {
    const user = useSelector((state) => state.users.user);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        dateRange: null,
        search: ''
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'credit' ? 
            <ArrowUpOutlined className="text-green-500" /> : 
            <ArrowDownOutlined className="text-red-500" />;
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-cyan-400" />
                    {new Date(date).toLocaleDateString()}
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <div className="flex items-center">
                    {getTypeIcon(type)}
                    <span className="ml-2 capitalize">{type}</span>
                </div>
            )
        },
        {
            title: 'Transaction ID',
            dataIndex: 'id',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <div className="flex items-center">
                    <DollarOutlined className="mr-2 text-cyan-400" />
                    ${amount.toFixed(2)}
                </div>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <Tooltip title={text}>
                    <span className="truncate block max-w-xs">{text}</span>
                </Tooltip>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} className="capitalize">
                    {status}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    onClick={() => {
                        setSelectedTransaction(record);
                        setModalVisible(true);
                    }}
                    className="text-cyan-400 hover:text-cyan-300"
                />
            )
        }
    ];

    const filteredTransactions = transactions.filter(transaction => {
        if (filters.status !== 'all' && transaction.status !== filters.status) return false;
        if (filters.type !== 'all' && transaction.type !== filters.type) return false;
        if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.dateRange) {
            const date = new Date(transaction.date);
            const [start, end] = filters.dateRange;
            if (date < start || date > end) return false;
        }
        return true;
    });

    const stats = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        successRate: (transactions.filter(t => t.status === 'completed').length / transactions.length * 100) || 0
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Statistics Cards */}
            <Row gutter={[24, 24]} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                        <Statistic
                            title={<span className="text-gray-300">Total Transactions</span>}
                            value={stats.totalTransactions}
                            valueStyle={{ color: '#00FFF7' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                        <Statistic
                            title={<span className="text-gray-300">Total Amount</span>}
                            value={stats.totalAmount}
                            prefix="$"
                            valueStyle={{ color: '#00FFF7' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                        <Statistic
                            title={<span className="text-gray-300">Success Rate</span>}
                            value={stats.successRate}
                            suffix="%"
                            valueStyle={{ color: '#00FFF7' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <Input
                        placeholder="Search transactions..."
                        prefix={<SearchOutlined className="text-cyan-400" />}
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                        className="w-64 bg-gray-700 border-gray-600 text-white"
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={value => setFilters({ ...filters, status: value })}
                        className="bg-gray-700 border-gray-600 text-white"
                    >
                        <Option value="all">All Status</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="failed">Failed</Option>
                    </Select>
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={value => setFilters({ ...filters, type: value })}
                        className="bg-gray-700 border-gray-600 text-white"
                    >
                        <Option value="all">All Types</Option>
                        <Option value="credit">Credit</Option>
                        <Option value="debit">Debit</Option>
                    </Select>
                    <RangePicker
                        onChange={dates => setFilters({ ...filters, dateRange: dates })}
                        className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                        icon={<DownloadOutlined />}
                        className="bg-cyan-500 hover:bg-cyan-600 border-none"
                    >
                        Export
                    </Button>
                </div>
            </Card>

            {/* Transactions Table */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500">
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} transactions`
                    }}
                    className="custom-table"
                />
            </Card>

            {/* Transaction Details Modal */}
            <Modal
                title="Transaction Details"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                className="custom-modal"
            >
                {selectedTransaction && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Transaction ID">
                            {selectedTransaction.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">
                            {new Date(selectedTransaction.date).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Type">
                            <Tag color={selectedTransaction.type === 'credit' ? 'green' : 'red'}>
                                {selectedTransaction.type.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount">
                            ${selectedTransaction.amount.toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Badge status={getStatusColor(selectedTransaction.status)} />
                            {selectedTransaction.status.toUpperCase()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {selectedTransaction.description}
                        </Descriptions.Item>
                        {selectedTransaction.recipient && (
                            <Descriptions.Item label="Recipient">
                                <div className="flex items-center">
                                    <UserOutlined className="mr-2" />
                                    {selectedTransaction.recipient}
                                </div>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
}

export default Transactions;