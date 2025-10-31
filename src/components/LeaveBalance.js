import React, { useEffect, useState } from 'react';
import { getLeaveBalance } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

function LeaveBalance() {
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();
  const userId = parseInt(sessionStorage.getItem('userId'), 10);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getLeaveBalance(userId);
        setBalance(response.data[0]); 
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        if (error.response?.status === 403){
          alert('Failed to load leave balance');
        }
      }
    };
    fetchBalance();
  }, [userId, navigate]);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

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
      <div style={{
        backgroundColor: '#00796b',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Smart Leave Manager</h1>
        <div>
          <Link to="/user-dashboard" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/apply-leave" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Apply Leave</Link>
          <Link to="/leave-calendar" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Calendar</Link>
          <Link to="/leave-requests" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Requests</Link>
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

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
