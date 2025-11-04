import React, { useState, useEffect } from 'react';
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
  const [showForm, setShowForm] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const token = sessionStorage.getItem('authToken');
  const adminId = sessionStorage.getItem('userId');

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
      fetchHolidays();
    } catch (error) {
      const msg = error.response?.data || 'Failed to add holiday.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  const handleSyncCalendar = async () => {
    if (!token || !adminId) return;

    try {
      const res = await axios.post(
        `http://localhost:8765/admin/update-calendar/${adminId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      fetchHolidays();
    } catch (error) {
      const msg = error.response?.data || 'Failed to sync calendar.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  const fetchHolidays = async () => {
    if (!token || !adminId) return;

    try {
      const res = await axios.get(
        `http://localhost:8765/admin/get-all-holidays/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHolidays(res.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    
    <div className="container mt-5">
  <h3>Manage Country Holidays 📅</h3>

  <div className="d-flex flex-wrap gap-3 mt-3">
      <a className="btn btn-primary text-white" href='https://docs.google.com/spreadsheets/d/1nkOpL4L6J9mDw2tLaezeO8KZnXxwhauCed1JG5u6bq8/edit?gid=0#gid=0'>
        Calendar URL
      </a>
    

  <button className="btn btn-warning " onClick={() => setShowForm(!showForm)}>
    {showForm ? 'Hide Form' : 'Add Single Holiday'}
  </button>

  <button className="btn btn-primary text-white" onClick={handleSyncCalendar}>
    Update Calendar
  </button>
</div>

  {showForm && (
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
  )}

  {message && <div className="alert alert-info mt-3">{message}</div>}

  <h5 className="mt-5">📋 All Holidays</h5>
  <div className="table-responsive mt-3">
    <table className="table table-bordered table-hover">
      <thead className="table-success">
        <tr>
          <th>ID</th>
          <th>Country</th>
          <th>Year</th>
          <th>Date</th>
          <th>Day</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {holidays.map((holiday) => (
          <tr key={holiday.holidayId}>
            <td>{holiday.holidayId}</td>
            <td>{holiday.countryName}</td>
            <td>{holiday.calendarYear}</td>
            <td>{holiday.holidayDate}</td>
            <td>{holiday.holidayDay}</td>
            <td>{holiday.holidayName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    
    
    
  );
}

export default AddCountryCalendar;