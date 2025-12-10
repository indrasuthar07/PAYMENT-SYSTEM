import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Select, Button, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function Settings() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
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
      const response = await api.get('/api/users/profile');
      dispatch(SetUser(response.data));
    } catch (error) {
      message.error('Failed to load user profile');
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.put('/api/users/profile', values);
      dispatch(SetUser(response.data.user));
      message.success('Settings updated successfully!');
    } catch (error) {
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-2">Please sign in to access settings</span>
          <button onClick={() => navigate('/signin')} className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabList = [
    { key: 'account', label: 'Account' },
    { key: 'security', label: 'Security' },
    { key: 'preferences', label: 'Preferences' },
  ];

  return (
    <div> {/* existing settings UI */} </div>
  );
}

export default Settings;
