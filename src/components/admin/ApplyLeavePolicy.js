import React, { useState, useEffect } from 'react';
import {
  addNewLeavePolicies,
  getAllRolesBasedLeavePolicies
} from '../../services/api';
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
  const [showForm, setShowForm] = useState(false);
  const [policies, setPolicies] = useState([]);
  const adminId = sessionStorage.getItem('userId');

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) return setMessage('Missing authentication. Please log in again.');

    try {
      const res = await addNewLeavePolicies(adminId, form);
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
      fetchPolicies();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to apply leave policy.');
    }
  };

  const fetchPolicies = async () => {
    if (!adminId) return;
    try {
      const res = await getAllRolesBasedLeavePolicies(adminId);
      setPolicies(res.data);
    } catch (err) {
      console.error('Error fetching policies:', err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Leave Policies 📝</h3>

      <button className="btn btn-primary mt-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Apply New Leave Policy'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a Role</option>
              {['TEAM_MEMBER', 'TEAM_LEAD', 'TEAM_MANAGER', 'HR_MANAGER', 'ADMIN'].map((role) => (
                <option
                  key={role}
                  value={role}
                  disabled={policies.some((p) => p.role === role)}
                >
                  {role}
                </option>
              ))}
            </select>
          </div>

          {[
            'sickLeave',
            'earnedLeave',
            'casualLeave',
            'paternityLeave',
            'maternityLeave',
            'lossOfPay',
          ].map((field) => (
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
      )}

      {message && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className="toast show text-bg-info border-0">
            <div className="d-flex">
              <div className="toast-body">{message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setMessage('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      <h5 className="mt-5">📋 Existing Leave Policies</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover">
          <thead className="table-success">
            <tr>
              <th>Role</th>
              <th>Sick</th>
              <th>Earned</th>
              <th>Casual</th>
              <th>Paternity</th>
              <th>Maternity</th>
              <th>Loss of Pay</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p, i) => (
              <tr key={i}>
                <td>{p.role}</td>
                <td>{p.sickLeave}</td>
                <td>{p.earnedLeave}</td>
                <td>{p.casualLeave}</td>
                <td>{p.paternityLeave}</td>
                <td>{p.maternityLeave}</td>
                <td>{p.lossOfPay}</td>
                <td>{p.totalLeaves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplyLeavePolicy;
