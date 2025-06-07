import './index.css';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Home from './pages/home';
import Transaction from './pages/Transictions';
import Profile from './pages/profile';
import Settings from './pages/settings';
import MainLayout from './components/Layout';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
}

function App() {
  useEffect(() => {
    document.title = 'Payment System';
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transaction />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
