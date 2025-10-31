import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded">
        <h2 className="mb-4">Select Your Role</h2>
        <button
          className="btn btn-outline-primary w-100 mb-3"
          onClick={() => navigate('/admin-login')}
        >
          Admin
        </button>
        <button
          className="btn btn-outline-success w-100"
          onClick={() => navigate('/user-login')}
        >
          User
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
