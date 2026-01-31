import React, { useState, useEffect } from 'react';
import { Avatar, Badge, message, Typography } from 'antd';
import { 
  User, 
  Wallet, 
  ArrowRightLeft, 
  LogOut, 
  CreditCard, 
  Landmark, 
  ShieldCheck, 
  Crown,
  ChevronRight
} from 'lucide-react'; // Using lucide for consistency with Home page
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetUser } from '../../redux/UserSlice';
import axios from 'axios';
import { API_URL } from '../../config';

const { Title, Text } = Typography;

function Profile() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (userResponse.data?.user) {
        setUserBalance(userResponse.data.user.balance || 0);
        dispatch(SetUser(userResponse.data.user));
      }
      const transactionsResponse = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (transactionsResponse.data.success) {
        setTransactions(transactionsResponse.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(SetUser(null));
    message.success('Logged out successfully');
    navigate('/signin');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pb-20">
      {/* Background Glows matching Home page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-blue-500/5 p-8 mb-8 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
              <User className="text-white text-5xl -rotate-3" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Title level={2} className="!mb-0 !font-black uppercase tracking-tight">
                {user?.firstName} {user?.lastName}
              </Title>
              <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                <Crown size={14} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
              </div>
            </div>
            <Text className="text-gray-500 text-lg block mb-1">{user?.email}</Text>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account ID</span>
              <span className="text-[20px] font-mono font-bold text-blue-600">{user?._id || 'PAY-7721-00X'}</span>
            </div>
            <br />
            <span className="text-[20px] font-bold text-gray-500">from this id you can recieve payments</span>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut className="text-red-600" /> Logout
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-xl shadow-blue-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Wallet className="text-white text-xl" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Available Funds</span>
            </div>
            <div className="text-4xl font-black mb-1">${userBalance.toFixed(2)}</div>
            <div className="text-xs opacity-70 font-medium">Updated just now</div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col justify-center"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Activity</span>
              <ArrowRightLeft className="text-blue-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">{transactions.length}</div>
            <div className="text-xs text-green-500 font-bold uppercase tracking-widest">All-time transactions</div>
          </motion.div>
        </div>

        {/* Action Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Controls */}
          <div className="space-y-4">
            <Title level={4} className="!font-bold !mb-6 ml-2">Account Controls</Title>
            {[
              { label: 'Payment Methods', icon: <CreditCard className="text-purple-600" />, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Bank Connections', icon: <Landmark className="text-blue-600" />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Security Settings', icon: <ShieldCheck className="text-green-600" />, color: 'text-green-600', bg: 'bg-green-50' }
            ].map((item, i) => (
              <button key={i} className="w-full p-4 bg-white border border-gray-50 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center text-lg`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-gray-700">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </button>
            ))}
          </div>

          {/* Activity Feed Snippet */}
          <div>
            <div className="flex justify-between items-center mb-6 px-2">
              <Title level={4} className="!font-bold !mb-0">Recent Activity</Title>
              <button onClick={() => navigate('/transactions')} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 4).map((transaction, idx) => (
                <div key={idx} className="p-4 bg-gray-50/50 rounded-2xl flex justify-between items-center border border-gray-100/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-xs font-black uppercase tracking-tighter text-gray-800">{transaction.type}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`font-black text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm font-medium italic">No recent movements</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;