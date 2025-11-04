import React, { useState, useEffect } from 'react';
import {
  applyLeave,
  calculateDuration,
  getLeaveBalance,
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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
  const [darkMode, setDarkMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const allLeavesLapsed = () => {
    if (!balance) return false;
    return leaveOptions.every(opt => !balance?.[opt.key] || balance?.[opt.key] === 0);
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getLeaveBalance(userId);
        setBalance(res.data[0]);
      } catch (err) {
        console.error('Failed to fetch leave balance:', err);
      }
    };
    if (userId) {
      fetchBalance();
    }
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
    if (userId) {
      autoCalculate();
    }
  }, [startDate, endDate, userId]);

  const resetForm = () => {
    setLeaveType('');
    setSecondaryLeaveType('');
    setStartDate('');
    setEndDate('');
    setComments('');
    setDuration(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSuccessMessage('');  // clear previous

    if (!userId || isNaN(userId)) {
      alert('Session expired. Please log in again.');
      sessionStorage.clear();
      navigate('/user-login');
      return;
    }

    if (!leaveType || !startDate || !endDate || duration === null) {
      alert('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be after start date.');
      setSubmitting(false);
      return;
    }

    const primaryKey = leaveType.toLowerCase() + 'Leave';
    const primaryAvailable = balance?.[primaryKey] || 0;
    const remaining = duration - primaryAvailable;

    try {
      if (remaining <= 0) {
        await applyLeave(userId, {
          leaveType,
          startDate,
          endDate,
          comments,
        });
        const msg = `✅ Leave applied successfully for ${duration} day(s)!`;
        console.log("DEBUG: Success branch, message:", msg);
        setSuccessMessage(msg);
      } else {
        if (!secondaryLeaveType) {
          alert(`Not enough ${leaveType} balance. Please select a fallback leave type.`);
          setSubmitting(false);
          return;
        }

        const midDate = new Date(startDate);
        midDate.setDate(midDate.getDate() + primaryAvailable - 1);
        const splitStart = new Date(midDate);
        splitStart.setDate(splitStart.getDate() + 1);

        const midDateStr = midDate.toISOString().split('T')[0];
        const splitStartStr = splitStart.toISOString().split('T')[0];

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

        const msg = `✅ Leave split: ${primaryAvailable} day(s) as ${leaveType}, ${remaining} day(s) as ${secondaryLeaveType}`;
        console.log("DEBUG: Success split branch, message:", msg);
        setSuccessMessage(msg);
      }

      // At this point: successMessage is set *immediately*
      // Now you can decide: either reload now or let user stay.
      // If you want immediate reload, uncomment below:
      // window.location.reload();

      // Otherwise: maybe reset the form after some time:
      setTimeout(() => {
        resetForm();
        setSubmitting(false);
        // Optionally clear the message again:
        // setSuccessMessage('');
      }, 1500);

    } catch (error) {
      console.error('Leave application failed:', error);
      alert('Failed to apply leave. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">📝 Apply for Leave</h2>
        </div>

        <div className="card p-4 shadow-sm">
          {successMessage && (
            <div className="alert alert-success text-center mb-3">
              {successMessage}
            </div>
          )}

          {allLeavesLapsed() && (
            <div className="alert alert-warning text-center">
              All leaves have lapsed or are unavailable. Please contact HR for assistance.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Leave Type</label>
              <select
                className="form-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
                disabled={submitting}
              >
                <option value="">Select Leave Type</option>
                {leaveOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({balance?.[opt.key] ?? '-'})
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  min={today}
                  disabled={submitting}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate || today}
                  disabled={submitting}
                />
              </div>
            </div>

            {calculating && (
              <div className="mb-3 text-muted">Calculating duration…</div>
            )}

            {duration !== null && !calculating && (
              <div className="mb-3">
                <p><strong>Calculated Duration:</strong> {duration} day(s)</p>
              </div>
            )}

            {duration !== null && balance && leaveType && (balance?.[leaveType.toLowerCase() + 'Leave'] || 0) < duration && (
              <div className="mb-3">
                <label className="form-label">
                  Not enough {leaveType} balance. Select another leave type for remaining {duration - (balance?.[leaveType.toLowerCase() + 'Leave'] || 0)} days:
                </label>
                <select
                  className="form-select"
                  value={secondaryLeaveType}
                  onChange={(e) => setSecondaryLeaveType(e.target.value)}
                  required
                  disabled={submitting}
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
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              Submit Leave Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ApplyLeave;
