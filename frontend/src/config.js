export const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://payment-system-tjgo.onrender.com';

export const API_URL = `${API_BASE_URL}/api`;
