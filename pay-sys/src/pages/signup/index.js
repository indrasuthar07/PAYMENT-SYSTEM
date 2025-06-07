import { Button, Input, Form, DatePicker, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetUser } from '../../redux/userSlice';

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Submitting registration form:', values);
      
      const response = await axios.post('http://localhost:5000/api/register', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth.toISOString(),
        mobileNo: values.mobileNo
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.message === 'User registered successfully') {
        // If the registration includes user data and token, store them
        if (response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          dispatch(SetUser(response.data.user));
          message.success('Registration successful!');
          navigate('/Home');
        } else {
          message.success('Registration successful! Please login.');
          navigate('/signin');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated background elements */}
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
                <h1 className="text-3xl font-bold text-white">Create</h1>
                <h1 className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors">Account</h1>
              </div>
              <p className="text-gray-300">Join the future of payments</p>
            </div>

            <Form
              layout="vertical"
              className="space-y-4"
              onFinish={onFinish}
              validateTrigger="onBlur"
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-600" />}
                    placeholder="First Name"
                    className="bg-gray-400 border-gray-600 text-black placeholder-gray-400 h-12 rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-600" />}
                    placeholder="Last Name"
                    className="bg-gray-400 border-gray-600 text-black placeholder-gray-400 h-12 rounded-lg"
                  />
                </Form.Item>
              </div>

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
                  className="bg-gray-400 border-gray-600 text-black placeholder-gray-400 h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="mobileNo"
                rules={[
                  { required: true, message: 'Please input your mobile number!' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined className="text-gray-600" />}
                  placeholder="Mobile Number"
                  className="bg-gray-400 border-gray-600 text-black placeholder-gray-400 h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <DatePicker
                  className="w-full h-12 bg-gray-400 border-gray-600 text-black rounded-lg"
                  placeholder="Date of Birth"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-gray-600" />}
                  placeholder="Password"
                  className="bg-gray-400 border-gray-600 text-black placeholder-gray-400 h-12 rounded-lg"
                />
              </Form.Item>

              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:opacity-90 transition-all duration-300 rounded-lg"
              >
                Register
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;