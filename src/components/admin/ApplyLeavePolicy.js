import React, { useState } from 'react';
import axios from 'axios';
import '../../css/admin/ApplyLeavePolicy.css';

function ApplyLeavePolicy() {
  const [form, setForm] = useState({
    role: '',
    sickLeave: '',
    earnedLeave: '',
    casualLeave: '',
    paternityLeave: '',
    maternityLeave: '',
    lossOfPay: '',
    totalLeaves: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = sessionStorage.getItem('authToken');
    const adminId = sessionStorage.getItem('userId');

    if (!token || !adminId) {
      setMessage('Missing authentication. Please log in again.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8765/admin/add-new-leave-policies/${adminId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      setForm({
        role: '',
        sickLeave: '',
        earnedLeave: '',
        casualLeave: '',
        paternityLeave: '',
        maternityLeave: '',
        lossOfPay: '',
        totalLeaves: '',
      });
    } catch (error) {
      const msg = error.response?.data || 'Failed to apply leave policy.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Apply Leave Policy 📝</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
            required
          />
        </div>

        {['sickLeave', 'earnedLeave', 'casualLeave', 'paternityLeave', 'maternityLeave', 'lossOfPay', 'totalLeaves'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input
              type="number"
              step="0.1"
              name={field}
              className="form-control"
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-success">Submit Policy</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default ApplyLeavePolicy;