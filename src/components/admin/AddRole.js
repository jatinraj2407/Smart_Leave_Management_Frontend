import React, { useState } from 'react';
import axios from 'axios';
import '../../css/admin/AddRole.css';

function AddRole() {
  const [form, setForm] = useState({ roleName: '', description: '' });
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
        `http://localhost:8765/admin/add-newrole/${adminId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      setForm({ roleName: '', description: '' });
    } catch (error) {
      const msg = error.response?.data || 'Failed to add role.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Add New Role 🛠️</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Role Name</label>
          <input
            type="text"
            name="roleName"
            className="form-control"
            value={form.roleName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Add Role</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default AddRole;