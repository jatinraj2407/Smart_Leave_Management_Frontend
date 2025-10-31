import React, { useState, useEffect } from 'react';
import {
  applyLeave,
  calculateDuration,
  getLeaveBalance,
} from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [secondaryLeaveType, setSecondaryLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const [duration, setDuration] = useState(null);
  const [balance, setBalance] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const navigate = useNavigate();
  const userId = parseInt(sessionStorage.getItem('userId'), 10);
  const today = new Date().toISOString().split('T')[0];

  const leaveOptions = [
    { label: 'Sick Leave', value: 'SICK', key: 'sickLeave' },
    { label: 'Earned Leave', value: 'EARNED', key: 'earnedLeave' },
    { label: 'Casual Leave', value: 'CASUAL', key: 'casualLeave' },
    { label: 'Paternity Leave', value: 'PATERNITY', key: 'paternityLeave' },
    { label: 'Maternity Leave', value: 'MATERNITY', key: 'maternityLeave' },
  ];

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getLeaveBalance(userId);
        setBalance(res.data[0]);
      } catch (err) {
        console.error('Failed to fetch leave balance:', err);
      }
    };
    fetchBalance();
  }, [userId]);

  useEffect(() => {
    const autoCalculate = async () => {
      if (startDate && endDate && new Date(endDate) >= new Date(startDate)) {
        setCalculating(true);
        try {
          const res = await calculateDuration(userId, { startDate, endDate });
          setDuration(res.data);
        } catch (err) {
          console.error('Failed to calculate duration:', err);
          setDuration(null);
        } finally {
          setCalculating(false);
        }
      } else {
        setDuration(null);
      }
    };
    autoCalculate();
  }, [startDate, endDate, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !duration) {
      alert('Please fill in all required fields.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be after start date.');
      return;
    }

    const primaryKey = leaveType.toLowerCase() + 'Leave';
    const primaryAvailable = balance[primaryKey] || 0;
    const remaining = duration - primaryAvailable;

    try {
      if (remaining <= 0) {
        await applyLeave(userId, {
          leaveType,
          startDate,
          endDate,
          comments,
        });
        alert(`Leave applied successfully for ${duration} day(s)!`);
      } else {
        if (!secondaryLeaveType) {
          alert(`You only have ${primaryAvailable} day(s) of ${leaveType} leave. Please select another leave type for remaining ${remaining} day(s).`);
          return;
        }

        const midDate = new Date(startDate);
        midDate.setDate(midDate.getDate() + primaryAvailable - 1);
        const splitStart = new Date(midDate);
        splitStart.setDate(splitStart.getDate() + 1);

        const splitStartStr = splitStart.toISOString().split('T')[0];
        const midDateStr = midDate.toISOString().split('T')[0];

        await applyLeave(userId, {
          leaveType,
          startDate,
          endDate: midDateStr,
          comments: comments + ' (Primary)',
        });

        await applyLeave(userId, {
          leaveType: secondaryLeaveType,
          startDate: splitStartStr,
          endDate,
          comments: comments + ' (Fallback)',
        });

        alert(`Leave split: ${primaryAvailable} day(s) as ${leaveType}, ${remaining} day(s) as ${secondaryLeaveType}`);
      }

      setLeaveType('');
      setSecondaryLeaveType('');
      setStartDate('');
      setEndDate('');
      setComments('');
      setDuration(null);
    } catch (error) {
      console.error('Leave application failed:', error);
      alert('Failed to apply leave. Please try again.');
    }
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  return (
    <>
      <div className="navbar">
        <h1>Smart Leave Manager</h1>
        <div>
          <Link to="/user-dashboard">Dashboard</Link>
          <Link to="/leave-calendar">Calendar</Link>
          <Link to="/leave-balance">Balance</Link>
          <Link to="/leave-requests">Requests</Link>
          <button onClick={handleSignOut} className="btn btn-link text-white">Sign Out</button>
        </div>
      </div>

      <div className="container mt-5">
        <h2>Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="card p-4 mt-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Leave Type</label>
            <select
              className="form-select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select Leave Type</option>
              {leaveOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({balance?.[opt.key] ?? '-'})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={today}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDate || today}
            />
          </div>

          {calculating && (
            <div className="mb-3 text-muted">Calculating duration...</div>
          )}

          {duration !== null && !calculating && (
            <div className="mb-3">
              <p><strong>Calculated Duration:</strong> {duration} day(s)</p>
            </div>
          )}

          {duration !== null && balance && leaveType && balance[leaveType.toLowerCase() + 'Leave'] < duration && (
            <div className="mb-3">
              <label className="form-label">
                Not enough {leaveType} balance. Select another leave type for remaining {duration - balance[leaveType.toLowerCase() + 'Leave']} day(s):
              </label>
              <select
                className="form-select"
                value={secondaryLeaveType}
                onChange={(e) => setSecondaryLeaveType(e.target.value)}
                required
              >
                <option value="">Select Additional Leave Type</option>
                {leaveOptions
                  .filter((opt) => opt.value !== leaveType)
                  .map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({balance?.[opt.key] ?? '-'})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              placeholder="Optional comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Leave Request
          </button>
        </form>
      </div>
    </>
  );
}

export default ApplyLeave;
