import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import api from '../../utils/api';

function TransferModal({ showTransferModal, setShowTransferModal, reloadData }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [receiverDetails, setReceiverDetails] = useState(null);

  const handleVerifyAccount = async (accountId) => {
    if (!accountId) {
      message.error('Please enter an account ID');
      return;
    }

    setVerifying(true);
    try {
      const response = await api.get(`/api/transactions/verify-account/${accountId}`);
      if (response.data.success) {
        setReceiverDetails(response.data.user);
        setAccountVerified(true);
        message.success('Account verified successfully');
      } else {
        message.error(response.data.message || 'Error verifying account');
      }
    } catch (error) {
      setAccountVerified(false);
      setReceiverDetails(null);
      message.error(error.response?.data?.message || 'Error verifying account');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (values) => {
    if (!localStorage.getItem('token')) {
      message.error('Please sign in to continue');
      return;
    }

    if (!receiverDetails?._id) {
      message.error('Please verify the receiver account first');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/transactions/transfer', {
        receiverId: receiverDetails._id,
        amount: parseFloat(values.amount),
        description: values.description,
        paymentMethod: values.paymentMethod,
      });

      if (response.data.success) {
        message.success('Transfer successful');
        form.resetFields();
        setAccountVerified(false);
        setReceiverDetails(null);
        setShowTransferModal(false);
        if (reloadData) {
          reloadData();
        }
      } else {
        message.error(response.data.message || 'Error processing transfer');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      const errorMessage = error.response?.data?.message || 'Error processing transfer';
      message.error(errorMessage);

      if (errorMessage.includes('Insufficient balance')) {
        message.error('You do not have enough balance to complete this transfer');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setAccountVerified(false);
    setReceiverDetails(null);
    setShowTransferModal(false);
  };

  return (
    <Modal title="Transfer Money" open={showTransferModal} onCancel={handleClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="accountId" label="Receiver's Account ID" rules={[{ required: true, message: 'Please enter account ID' }]}> 
          <Input placeholder="Enter account ID" disabled={verifying} />
        </Form.Item>
        <Button type="primary" onClick={() => handleVerifyAccount(form.getFieldValue('accountId'))} loading={verifying} style={{ marginBottom: 16 }}>
          Verify Account
        </Button>
        {receiverDetails && (
          <div style={{ marginBottom: 16 }}>
            <p>Account Holder: {receiverDetails.firstName} {receiverDetails.lastName}</p>
            <p>Email: {receiverDetails.email}</p>
          </div>
        )}

        <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter amount' }, { type: 'number', transform: (value) => Number(value), min: 1, message: 'Amount must be greater than 0' }]}>
          <Input type="number" placeholder="Enter amount" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!accountVerified} block>
            Transfer
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TransferModal;
