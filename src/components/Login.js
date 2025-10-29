import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser({ userName, password });
      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem('authToken', res.data.token);
        }
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Please fill the details');
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
          <h4 className="mt-3">Welcome! 👋</h4>
          <p className="text-muted">Please sign in to manage holidays.</p>
        </div>

        <div className="mb-3">
          <label className="form-label">USERNAME</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Sign in
        </button>

        <div className="mt-3 text-center">
          <Link to="/forgot-password" className="d-block text-decoration-none text-primary">
            Forgot Password?
          </Link>
          <Link to="/register" className="d-block text-decoration-none text-secondary">
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
