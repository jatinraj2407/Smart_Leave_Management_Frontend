import React, { useState, useEffect } from 'react';
import {
  applyLeave,
  calculateDuration,
  getLeaveBalance,
  getUserLeaveRequests ,
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

const leaveOptions = [
  { label: 'Sick Leave', value: 'SICK', key: 'sickLeave' },
  { label: 'Earned Leave', value: 'EARNED', key: 'earnedLeave' },
  { label: 'Casual Leave', value: 'CASUAL', key: 'casualLeave' },
  { label: 'Paternity Leave', value: 'PATERNITY', key: 'paternityLeave' },
  { label: 'Maternity Leave', value: 'MATERNITY', key: 'maternityLeave' },
];

const getToday = () => new Date().toISOString().split('T')[0];

const ApplyLeave = () => {
  const navigate = useNavigate();
  const userId = parseInt(sessionStorage.getItem('userId'), 10);

  const [form, setForm] = useState({
    leaveType: '', secondaryLeaveType: '', startDate: '', endDate: '', comments: ''
  });
  const [duration, setDuration] = useState(null);
  const [balance, setBalance] = useState(null);
  const [existingLeaves, setExistingLeaves] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const primaryKey = form.leaveType.toLowerCase() + 'Leave';
  const primaryAvailable = balance?.[primaryKey] || 0;
  const insufficientBalance = duration !== null && primaryAvailable < duration;

  useEffect(() => {
    if (userId) {
      getLeaveBalance(userId).then(res => setBalance(res.data[0]));
      getUserLeaveRequests (userId).then(res => setExistingLeaves(res.data));
    }
  }, [userId]);

  useEffect(() => {
    if (form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate)) {
      setCalculating(true);
      calculateDuration(userId, { startDate: form.startDate, endDate: form.endDate })
        .then(res => setDuration(res.data))
        .catch(() => setDuration(null))
        .finally(() => setCalculating(false));
    } else {
      setDuration(null);
    }
  }, [form.startDate, form.endDate, userId]);

  const allLeavesLapsed = () =>
    leaveOptions.every(opt => !balance?.[opt.key] || balance?.[opt.key] === 0);

  const resetForm = () => setForm({
    leaveType: '', secondaryLeaveType: '', startDate: '', endDate: '', comments: ''
  });

  const isOverlapping = (start, end) => {
    const newStart = new Date(start);
    const newEnd = new Date(end);
    return existingLeaves.some(({ startDate, endDate }) => {
      const existingStart = new Date(startDate);
      const existingEnd = new Date(endDate);
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSuccessMessage('');

    const { leaveType, secondaryLeaveType, startDate, endDate, comments } = form;
    if (!userId || !leaveType || !startDate || !endDate || duration === null || new Date(endDate) < new Date(startDate)) {
      alert('Please fill in all required fields correctly.');
      setSubmitting(false);
      return;
    }

    if (isOverlapping(startDate, endDate)) {
      alert('You already have a leave request during this period.');
      setSubmitting(false);
      return;
    }

    try {
      if (!insufficientBalance) {
        await applyLeave(userId, { leaveType, startDate, endDate, comments });
        setSuccessMessage(`✅ Leave applied successfully for ${duration} day(s)!`);
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

        await applyLeave(userId, {
          leaveType, startDate, endDate: midDate.toISOString().split('T')[0],
          comments: comments + ' (Primary)'
        });
        await applyLeave(userId, {
          leaveType: secondaryLeaveType,
          startDate: splitStart.toISOString().split('T')[0],
          endDate, comments: comments + ' (Fallback)'
        });

        setSuccessMessage(`✅ Leave split: ${primaryAvailable} day(s) as ${leaveType}, ${duration - primaryAvailable} day(s) as ${secondaryLeaveType}`);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        resetForm();
        setSubmitting(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Leave application failed:', err);
      alert('Failed to apply leave. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card border-0 shadow-lg rounded">
          <div className="card-header text-white" style={{ backgroundColor: '#00796b' }}>
            <h4 className="mb-0"><i className="bi bi-pencil-square me-2"></i>Apply for Leave</h4>
          </div>

          <div className="card-body bg-light">
            {successMessage && (
              <div className="alert alert-success text-center mb-4 animate__animated animate__fadeIn">
                <i className="bi bi-check-circle-fill me-2"></i>{successMessage}
              </div>
            )}

            {allLeavesLapsed() && (
              <div className="alert alert-warning text-center mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                All leaves have lapsed. Please contact HR.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Leave Type</label>
                <select className="form-select" value={form.leaveType}
                  onChange={e => setForm({ ...form, leaveType: e.target.value })}
                  disabled={submitting} required>
                  <option value="">Select Leave Type</option>
                  {leaveOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({balance?.[opt.key] ?? '-'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Start Date</label>
                  <input type="date" className="form-control" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    min={getToday()} disabled={submitting} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">End Date</label>
                  <input type="date" className="form-control" value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    min={form.startDate || getToday()} disabled={submitting} required />
                </div>
              </div>

              {calculating && <div className="mb-3 text-muted">Calculating duration…</div>}
              {duration !== null && !calculating && (
                <div className="mb-3"><strong>Duration:</strong> {duration} day(s)</div>
              )}

              {insufficientBalance && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Fallback Leave Type</label>
                  <select className="form-select" value={form.secondaryLeaveType}
                    onChange={e => setForm({ ...form, secondaryLeaveType: e.target.value })}
                    required disabled={submitting}>
                    <option value="">Select Fallback Leave Type</option>
                    {leaveOptions.filter(opt => opt.value !== form.leaveType).map(opt => (
                      <option key={opt.value} value={opt.value}>
                                        {opt.label} ({balance?.[opt.key] ?? '-'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold">Comments</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Optional comments"
                  value={form.comments}
                  onChange={e => setForm({ ...form, comments: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Leave Request'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyLeave;

