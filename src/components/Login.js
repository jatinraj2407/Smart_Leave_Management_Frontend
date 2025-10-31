import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css';

function Login({ role = 'User' }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const res = await login(role, { userName, password });

      if (res.status === 200 && res.data.token) {
        const decoded = jwtDecode(res.data.token);
        sessionStorage.setItem('authToken', res.data.token);
        sessionStorage.setItem('userId', decoded.userId);
        sessionStorage.setItem('role', role);
        navigate(role === 'Admin' ? '/admin-dashboard' : '/user-dashboard');
      } else {
        alert('Login failed. No token received.');
      }
    } catch (error) {
      const msg = error.response?.data;
      alert(typeof msg === 'string' ? msg : 'Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-card p-4 shadow rounded bg-white">
        <div className="text-center mb-4">
          <img
            src="https://i.pinimg.com/736x/3f/5a/d8/3f5ad816179850d23695910e906554a7.jpg"
            alt="Logo"
            style={{ width: '100px' }}
          />
          <h4 className="mt-3">Welcome {role}! 👋</h4>
          <p className="text-muted">Please sign in to manage holidays.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">USERNAME</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">PASSWORD</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign in
          </button>
        </form>

        <div className="mt-3 text-center">
          <Link to="/forgot-password" className="d-block text-decoration-none text-primary">
            Forgot Password?
          </Link>
          <Link
            to={role === 'Admin' ? '/admin-register' : '/user-register'}
            className="d-block text-decoration-none text-secondary"
          >
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
