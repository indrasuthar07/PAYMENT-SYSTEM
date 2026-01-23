import { Button, Input, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';
import { API_URL, API_BASE_URL } from '../../config';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // ✅ Always use a single API base URL
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true } // helps if your backend uses cookies / sessions
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(SetUser(response.data.user));
        message.success('Login successful!');
        navigate('/home');
      } else {
        message.error('Invalid response from server.');
      }
    } catch (error) {
      console.error("Login Error:", error);
      message.error(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="glass-card w-full max-w-md mx-auto p-8 shadow-2xl flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2">
            <h1 className="text-3xl font-bold text-blue-700">Welcome</h1>
            <h1 className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Back
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        {/* Form */}
        <Form layout="vertical" className="space-y-4 w-full" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-blue-600" />}
              placeholder="Email"
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-blue-600" />}
              placeholder="Password"
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-400 border-none hover:from-blue-700 hover:to-blue-500 transition-all duration-300 rounded-lg text-white font-semibold"
          >
            Sign In
          </Button>
        </Form>

        {/* Divider */}
        <div className="w-full my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="default"
          onClick={() => {
            window.location.href = `${API_URL}/auth/google`;
          }}
          className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </Button>

        {/* Footer */}
        <div className="mt-6 text-center w-full">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
