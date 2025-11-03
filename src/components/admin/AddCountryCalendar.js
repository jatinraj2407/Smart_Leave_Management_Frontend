import React, { useState } from 'react';
import axios from 'axios';
import '../../css/admin/AddCountryCalendar.css';

function AddCountryCalendar() {
  const [form, setForm] = useState({
    countryName: '',
    calendarYear: '',
    holidayName: '',
    holidayDate: '',
  });

  const [message, setMessage] = useState('');

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

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

    const payload = {
      countryName: form.countryName,
      calendarYear: parseInt(form.calendarYear),
      holidayName: form.holidayName,
      holidayDate: form.holidayDate,
      holidayDay: getDayOfWeek(form.holidayDate),
    };

    try {
      const res = await axios.post(
        `http://localhost:8765/admin/add-new-country-calendar/${adminId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      setForm({
        countryName: '',
        calendarYear: '',
        holidayName: '',
        holidayDate: '',
      });
    } catch (error) {
      const msg = error.response?.data || 'Failed to add holiday.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Add Country Holiday 📅</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Country Name</label>
          <input
            type="text"
            name="countryName"
            className="form-control"
            value={form.countryName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Calendar Year</label>
          <input
            type="number"
            name="calendarYear"
            className="form-control"
            value={form.calendarYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Holiday Name</label>
          <input
            type="text"
            name="holidayName"
            className="form-control"
            value={form.holidayName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Holiday Date</label>
          <input
            type="date"
            name="holidayDate"
            className="form-control"
            value={form.holidayDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Add Holiday</button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default AddCountryCalendar;