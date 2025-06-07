import { Button, Input, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetUser } from '../../redux/userSlice';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/login', {
        email: values.email,
        password: values.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(SetUser(response.data.user));
        message.success('Login successful!');
        navigate('/Home');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
     
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass card */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center space-x-2">
                <h1 className="text-3xl font-bold text-white">Welcome</h1>
                <h1 className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors">Back</h1>
              </div>
              <p className="text-gray-300 mt-2">Sign in to continue</p>
            </div>

            <Form
              layout="vertical"
              className="space-y-4"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-600" />}
                  placeholder="Email"
                  className="bg-gray-400 border-gray-600 text-black placeholder-gray-600 h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-gray-600" />}
                  placeholder="Password"
                  className=" bg-gray-400 border-gray-600 text-black placeholder-gray-600 h-12 rounded-lg"
                />
              </Form.Item>

              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:opacity-90 transition-all duration-300 rounded-lg"
              >
                Sign In
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;