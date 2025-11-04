import React, { useState, useEffect } from 'react';
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
  const [showForm, setShowForm] = useState(false);
  const [policies, setPolicies] = useState([]);

  const token = sessionStorage.getItem('authToken');
  const adminId = sessionStorage.getItem('userId');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

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
      fetchPolicies(); // Refresh list
    } catch (error) {
      const msg = error.response?.data || 'Failed to apply leave policy.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  const fetchPolicies = async () => {
    if (!token || !adminId) return;

    try {
      const res = await axios.get(
        `http://localhost:8765/admin/get-all-roles-based-leaves-policies/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPolicies(res.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
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
                  disabled={policies.some((p) => p.role === role)} // Disable if policy already exists for this role
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
            'totalLeaves',
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

      {message && <div className="alert alert-info mt-3">{message}</div>}

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
            {policies.map((policy, index) => (
              <tr key={index}>
                <td>{policy.role}</td>
                <td>{policy.sickLeave}</td>
                <td>{policy.earnedLeave}</td>
                <td>{policy.casualLeave}</td>
                <td>{policy.paternityLeave}</td>
                <td>{policy.maternityLeave}</td>
                <td>{policy.lossOfPay}</td>
                <td>{policy.totalLeaves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplyLeavePolicy;
