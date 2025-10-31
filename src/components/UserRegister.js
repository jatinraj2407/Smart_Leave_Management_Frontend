import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserRegister() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    userName: '',
    password: '',
    countryName: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic client-side validation
    for (const key in form) {
      if (!form[key]) {
        setErrorMsg(`Please fill out the ${key} field.`);
        return;
      }
    }

    try {
      const res = await axios.post('/users/registration', form);
      alert(res.data); // Expected: "User registered successfully"
    } catch (error) {
      const msg = error.response?.data;
      setErrorMsg(typeof msg === 'string' ? msg : 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Welcome User! 👋</h2>
      <p className="text-muted">Please register to manage holidays.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="firstName"
            className="form-control"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="lastName"
            className="form-control"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="tel"
            name="phoneNumber"
            className="form-control"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="address"
            className="form-control"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

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
            type="text"
            name="userName"
            className="form-control"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            minLength={6}
            title="Password must be at least 6 characters long"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="countryName"
            className="form-control"
            placeholder="Country Name"
            value={form.countryName}
            onChange={handleChange}
            required
          />
        </div>

        {errorMsg && <div className="text-danger mb-3">{errorMsg}</div>}

        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default UserRegister;
