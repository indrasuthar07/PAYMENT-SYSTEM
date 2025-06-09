import React from 'react';
import { Row, Col, Card, Typography, Tabs } from 'antd';
import { QrcodeOutlined, CameraOutlined } from '@ant-design/icons';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import QRCodeScanner from '../../components/QRCodeScanner';

const { Title } = Typography;

function QRCodePage() {
    const items = [
        {
            key: '1',
            label: (
                <span>
                    <QrcodeOutlined />
                    Generate QR Code
                </span>
            ),
            children: (
                <Row justify="center">
                    <Col xs={24} sm={20} md={16} lg={12}>
                        <QRCodeGenerator />
                    </Col>
                </Row>
            )
        },
        {
            key: '2',
            label: (
                <span>
                    <CameraOutlined />
                    Scan QR Code
                </span>
            ),
            children: (
                <Row justify="center">
                    <Col xs={24} sm={20} md={16} lg={12}>
                        <QRCodeScanner />
                    </Col>
                </Row>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <Title level={2} className="mb-8">QR Code Payments</Title>
            <Tabs defaultActiveKey="1" centered items={items} />
        </div>
    );
}

export default QRCodePage; 