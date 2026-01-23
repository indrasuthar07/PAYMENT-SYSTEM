import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

import { useDispatch } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';
import axios from 'axios';
import { message } from 'antd';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token && userId) {
      // Verify token and get user data
      axios.post(`${API_URL}/auth/google/verify`, { token })
        .then((response) => {
          if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            dispatch(SetUser(response.data.user));
            message.success('Login successful!');
            navigate('/home');
          } else {
            message.error('Authentication failed');
            navigate('/signin');
          }
        })
        .catch((error) => {
          console.error('Auth verification error:', error);
          message.error('Authentication failed');
          navigate('/signin');
        });
    } else {
      message.error('Invalid authentication response');
      navigate('/signin');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default AuthCallback;
