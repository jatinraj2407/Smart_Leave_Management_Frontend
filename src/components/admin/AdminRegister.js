import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { registerAdmin } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function AdminRegister() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    userName: '',
    password: '',
    role: 'ADMIN',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    for (const key in form) {
      if (!form[key]) {
        setErrorMsg(`Please fill out the ${key} field.`);
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await registerAdmin(form);
      alert(res.data || 'Admin registered successfully!');
      navigate('/admin-login');
    } catch (error) {
      const msg = error.response?.data;
      setErrorMsg(typeof msg === 'string' ? msg : 'Registration failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 position-relative">
      {/* Top-right login button */}
      <div className="position-absolute top-0 end-0 m-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin-login')}
        >
          &larr; Back to Login
        </button>
      </div>

      <h2 className="mb-4">Welcome Admin! 👋</h2>
      <p className="text-muted">Please register to manage holidays.</p>

      <form onSubmit={handleSubmit}>
        {['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'userName'].map((field) => (
          <div className="mb-3" key={field}>
            <input
              type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
              name={field}
              className="form-control"
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              value={form[field]}
              onChange={handleChange}
              required
              pattern={field === 'phoneNumber' ? '[0-9]{10}' : undefined}
            />
          </div>
        ))}

        <div className="mb-3">
          <select
            name="gender"
            className="form-select"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="mb-3">
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Password"
            minLength={6}
            title="Password must be at least 6 characters long"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {errorMsg && <div className="text-danger mb-3">{errorMsg}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;
