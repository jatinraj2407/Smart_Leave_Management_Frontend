import React, { useEffect, useState } from 'react';
import { getLeaveBalance } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

function LeaveBalance() {
  const [balance, setBalance] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const userId = parseInt(sessionStorage.getItem('userId'), 10);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getLeaveBalance(userId);
        setBalance(response.data[0]);
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        if (error.response?.status === 403) {
          alert('Failed to load leave balance');
        }
      }
    };
    fetchBalance();
  }, [userId]);

  const cardStyle = {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '1rem',
    backgroundColor: '#fff',
    textAlign: 'center',
    marginBottom: '1rem',
  };

  const leaveTypes = [
    { label: 'Sick Leave', key: 'sickLeave' },
    { label: 'Casual Leave', key: 'casualLeave' },
    { label: 'Earned Leave', key: 'earnedLeave' },
    { label: 'Loss of Pay', key: 'lossOfPay' },
    { label: 'Paternity Leave', key: 'paternityLeave' },
    { label: 'Maternity Leave', key: 'maternityLeave' },
    { label: 'Total Leaves', key: 'totalLeaves' },
  ];

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="container mt-5">
        <h2 className="mb-4 text-center">🧮 Leave Balance Overview</h2>
        {balance ? (
          <div className="row">
            {leaveTypes.map((type) => (
              <div key={type.key} className="col-md-4">
                <div style={cardStyle}>
                  <h5 style={{ color: '#00796b' }}>{type.label}</h5>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{balance[type.key]}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Loading leave balance...</p>
        )}
      </div>
    </>
  );
}

export default LeaveBalance;
