import React, { useState } from 'react';
import { registerUser } from '../services/api';

function Register() {
  const [form, setForm] = useState({ userName: '', password: '', email: '' });

  const handleSubmit = async () => {
    try {
      await registerUser(form);
      alert('Registered successfully!');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setForm({ ...form, userName: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default Register;
