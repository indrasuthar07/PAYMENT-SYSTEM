import api from '../../utils/api';
import { SetUser, SetLoading, SetError, ClearUser } from '../UserSlice';

// Note: api already sets baseURL using env vars (VITE_API_BASE_URL or REACT_APP_API_BASE_URL)

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(SetLoading(true));
    const response = await api.post('/api/login', { email, password });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(SetUser(response.data.user));
    }

    return response.data;
  } catch (error) {
    dispatch(SetError(error.response?.data?.message || 'Login failed'));
    throw error;
  } finally {
    dispatch(SetLoading(false));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(SetLoading(true));
    const response = await api.post('/api/register', userData);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(SetUser(response.data.user));
    }

    return response.data;
  } catch (error) {
    dispatch(SetError(error.response?.data?.message || 'Registration failed'));
    throw error;
  } finally {
    dispatch(SetLoading(false));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(ClearUser());
};

export const checkAuth = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      dispatch(ClearUser());
      return;
    }

    // Set user from localStorage immediately
    dispatch(SetUser(JSON.parse(user)));

    // Verify token with backend
    try {
      await api.get('/api/users/me');
    } catch (error) {
      // If token verification fails, clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(ClearUser());
    }
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(ClearUser());
  }
};
