import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetUser } from '../redux/UserSlice';
import { 
    BellOutlined, 
    SettingOutlined, 
    QuestionCircleOutlined, 
    GlobalOutlined,
    QrcodeOutlined,
    HomeOutlined,
    TransactionOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Badge, Tooltip, Button, Dropdown } from 'antd';

function Layout({ children }) {
    const { user, loading } = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        dispatch(SetUser(null));
        localStorage.removeItem('token');
        navigate('/signin');
    };

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/home">Home</Link>
        },
        {
            key: 'transactions',
            icon: <TransactionOutlined />,
            label: <Link to="/transactions">Transactions</Link>
        },
        {
            key: 'qrcode',
            icon: <QrcodeOutlined />,
            label: <Link to="/qrcode">QR Code Payments</Link>
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link to="/profile">Profile</Link>
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <Link to="/settings">Settings</Link>
        }
    ];

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Profile',
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            label: 'Settings',
            onClick: () => navigate('/settings')
        },
        {
            key: 'logout',
            label: 'Logout',
            onClick: handleLogout
        }
    ];

    return (
        <div className="min-h-screen flex bg-[#C0C0C0]">
            {/* Sidebar */}
            <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-[#C0C0C0]/90 backdrop-blur-xl shadow-2xl flex flex-col items-center py-8 border-r border-gray-700/50 transition-all duration-300`}>
                <div className="mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col h-full w-full">
                    <div>
                        <h2 className={`text-2xl text-center font-bold text-gray-800 mb-2 px-4 ${collapsed ? 'hidden' : 'block'}`}>
                          ₹ PAY-SYSTEM
                        </h2>
                        <div className="w-full border-b border-gray-700/50 mb-6"></div>
                        <nav className="flex flex-col gap-2 w-full px-4">
                            {menuItems.map((item) => (
                                <Tooltip 
                                    key={item.path}
                                    title={collapsed ? item.label : ''}
                                    placement="right"
                                >
                                    <Link 
                                        to={item.path} 
                                        className={`flex items-center gap-3 py-3 px-4 font-medium transition-all duration-200 rounded-lg ${
                                            location.pathname === item.path 
                                            ? 'bg-gradient-to-r from-gray-700/40 to-gray-900/40 text-white border-l-4 border-blue-400' 
                                            : 'text-gray-700 hover:bg-white/10 hover:text-gray-900'
                                        }`}
                                    >
                                        {item.icon}
                                        <span className={`font-mono text-gray-800 tracking-wide ${collapsed ? 'hidden' : 'block'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                </Tooltip>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto px-4 pb-4">
                        <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 text-gray-800 text-center shadow-lg border border-gray-700/50">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center ring-2 ring-blue-400/20">
                                    <span className="text-lg font-bold text-white">
                                        {user?.firstName?.[0] || 'U'}
                                    </span>
                                </div>
                                {!collapsed && (
                                    <div className="text-left">
                                        <span className="block text-xs opacity-70 font-mono tracking-wider">LOGGED IN AS</span>
                                        <span className="font-bold text-gray-800 font-mono tracking-wide">
                                            {loading ? 'Loading...' : (user?.firstName || 'User')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-2 w-full py-2 px-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
                            >
                                {collapsed ? 'Log' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-[#C0C0C0]/90 backdrop-blur-xl text-gray-800 p-4 shadow-lg border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Payment System</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Tooltip title="Notifications">
                                <Badge count={3} size="small">
                                    <Button 
                                        type="text" 
                                        icon={<BellOutlined className="text-30px text-gray-800" />}
                                        className="hover:bg-white/10"
                                    />
                                </Badge>
                            </Tooltip>
                            <Tooltip title="Help Center">
                                <Button 
                                    type="text" 
                                    icon={<QuestionCircleOutlined className="text-6xl text-gray-800" />}
                                    className="hover:bg-white/10"
                                />
                            </Tooltip>
                            <Tooltip title="Language">
                                <Button 
                                    type="text" 
                                    icon={<GlobalOutlined className="text-6xl text-gray-800" />}
                                    className="hover:bg-white/10"
                                />
                            </Tooltip>
                            <Dropdown 
                                menu={{ items: userMenuItems }} 
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Button 
                                    type="text" 
                                    icon={<SettingOutlined className="text-xl text-gray-800" />}
                                    className="hover:bg-white/10"
                                />
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <main className="flex-grow p-8 bg-[#C0C0C0] text-gray-800">
                    <div className="rounded-xl border border-gray-700/50 bg-white/90 backdrop-blur-xl p-6 shadow-2xl">
                        <Outlet />
                    </div>
                </main>
                <footer className="bg-[#C0C0C0]/90 backdrop-blur-xl text-gray-800 p-4 text-center shadow-lg border-t border-gray-700/50">
                    <div className="flex justify-between items-center max-w-6xl mx-auto">
                        <span className="text-gray-600">&copy; {new Date().getFullYear()} Payment System</span>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Layout;          