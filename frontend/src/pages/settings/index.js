import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Select, Button, message, Typography, Progress, Tooltip, Divider } from 'antd';
import { 
  User, 
  Lock, 
  Phone, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Sliders, 
  Globe, 
  Moon,
  Smartphone,
  Key,
  Bell,
  Trash2,
  Info,
  Badge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const { Option } = Select;
const { Title, Text } = Typography;

function Settings() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Advanced State: Password Strength
  const [password, setPassword] = useState('');
  
  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length > 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  useEffect(() => {
    if (!user) { navigate('/signin'); return; }
    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/signin');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(SetUser(response.data));
    } catch (error) {
      message.error('Failed to load user profile');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/profile`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(SetUser(response.data.user || response.data));
      message.success('Settings updated successfully!');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabList = [
    { key: 'account', label: 'Profile', icon: <User size={18} /> },
    { key: 'security', label: 'Privacy', icon: <ShieldCheck size={18} /> },
    { key: 'notifications', label: 'Alerts', icon: <Bell size={18} /> },
    { key: 'preferences', label: 'Display', icon: <Sliders size={18} /> },
  ];

  if (authLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pb-24">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24">
        
        {/* Advanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
              <SettingsIcon size={14} className="text-blue-600" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Command Center</span>
            </div>
            <Title level={1} className="!font-black !mb-0 tracking-tighter">ADVANCED SETTINGS</Title>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            {tabList.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.key 
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                  : 'bg-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content Window */}
          <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'account' && (
                  <Form layout="vertical" onFinish={onFinish} initialValues={user} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <Title level={4} className="col-span-full !font-black !mb-6">Personal Identity</Title>
                    <Form.Item name="firstName" label={<span className="text-[10px] font-black uppercase text-gray-400">First Name</span>}>
                      <Input className="h-12 rounded-xl bg-gray-50 border-none" />
                    </Form.Item>
                    <Form.Item name="lastName" label={<span className="text-[10px] font-black uppercase text-gray-400">Last Name</span>}>
                      <Input className="h-12 rounded-xl bg-gray-50 border-none" />
                    </Form.Item>
                    <Form.Item name="email" className="col-span-full" label={<span className="text-[10px] font-black uppercase text-gray-400">Primary Email</span>}>
                      <Input disabled className="h-12 rounded-xl bg-gray-100/50 border-none opacity-60" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} className="col-span-full h-14 bg-blue-600 rounded-2xl font-black uppercase border-none mt-4">
                      Update Profile
                    </Button>
                  </Form>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <Title level={4} className="!font-black !mb-6">Security & Access</Title>
                    
                    {/* Password Strength Section */}
                    <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center">
                        <Text className="font-bold">Change Password</Text>
                        <Tooltip title="At least 8 chars, uppercase, and special symbol">
                          <Info size={16} className="text-gray-400" />
                        </Tooltip>
                      </div>
                      <Input.Password 
                        placeholder="••••••••" 
                        onChange={(e) => setPassword(e.target.value)}
                        prefix={<Lock size={16} className="text-blue-600" />} 
                        className="h-12 rounded-xl border-none shadow-sm" 
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span>Strength</span>
                          <span className={calculateStrength(password) > 50 ? 'text-green-500' : 'text-red-500'}>
                            {calculateStrength(password)}%
                          </span>
                        </div>
                        <Progress percent={calculateStrength(password)} showInfo={false} strokeColor="#3b82f6" trailColor="#e5e7eb" strokeWidth={4} />
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="space-y-4">
                      <Text className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Connected Devices</Text>
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Smartphone size={20}/></div>
                          <div>
                            <div className="font-bold text-sm text-gray-800">iPhone 15 Pro</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold">Current Session • New York, USA</div>
                          </div>
                        </div>
                        <Badge status="processing" color="green" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <Title level={4} className="!font-black">Smart Alerts</Title>
                    {[
                      { label: 'Payment Receipts', desc: 'Instant email for every transaction', icon: <Bell /> },
                      { label: 'Security Alerts', desc: 'Notify on new device logins', icon: <ShieldCheck /> },
                      { label: 'Marketing', desc: 'New feature updates and offers', icon: <Smartphone /> }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="font-bold text-gray-800">{item.label}</div>
                          <div className="text-xs text-gray-400 font-medium">{item.desc}</div>
                        </div>
                        <Switch defaultChecked className="bg-blue-600" />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <Title level={4} className="!font-black">Global Display</Title>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">System Language</label>
                        <Select defaultValue="en" className="w-full h-12 rounded-xl custom-select" suffixIcon={<Globe size={16}/>}>
                          <Option value="en">English (US)</Option>
                          <Option value="fr">French</Option>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Theme Mode</label>
                        <Select defaultValue="light" className="w-full h-12 rounded-xl" suffixIcon={<Moon size={16}/>}>
                          <Option value="light">Glass Light</Option>
                          <Option value="dark">Midnight Pro</Option>
                        </Select>
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-red-900">Danger Zone</div>
                        <div className="text-xs text-red-500 font-medium">Permanently delete your account and data.</div>
                      </div>
                      <Button danger type="text" icon={<Trash2 size={18}/>} className="font-bold uppercase tracking-widest text-[10px]">Deactivate</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;