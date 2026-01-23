export const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://payment-system-777.onrender.com';

export const API_URL = `${API_BASE_URL}/api`;
