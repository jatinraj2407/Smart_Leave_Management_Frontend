import React, { useState, useEffect } from 'react';
import {
  addNewCountryCalendar,
  updateCalendar,
  getAllAdminHolidays
} from '../../services/api';
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
  const adminId = sessionStorage.getItem('userId');

  const getDayOfWeek = (date) =>
    new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) return setMessage('Missing authentication. Please log in again.');

    const payload = {
      ...form,
      calendarYear: parseInt(form.calendarYear),
      holidayDay: getDayOfWeek(form.holidayDate),
    };

    try {
      const res = await addNewCountryCalendar(adminId, payload);
      setMessage(res.data);
      setForm({ countryName: '', calendarYear: '', holidayName: '', holidayDate: '' });
      fetchHolidays();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to add holiday.');
    }
  };

  const handleSyncCalendar = async () => {
    if (!adminId) return;
    try {
      const res = await updateCalendar(adminId, {});
      setMessage(res.data);
      fetchHolidays();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to sync calendar.');
    }
  };

  const fetchHolidays = async () => {
    if (!adminId) return;
    try {
      const res = await getAllAdminHolidays(adminId);
      setHolidays(res.data);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <>
      {message && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className="toast show text-bg-info border-0">
            <div className="d-flex">
              <div className="toast-body">{message}</div>
              <button className="btn-close btn-close-white me-2 m-auto" onClick={() => setMessage('')}></button>
            </div>
          </div>
        </div>
      )}

      <div className="container mt-5">
        <h3>Manage Country Holidays 📅</h3>

        <div className="d-flex flex-wrap gap-3 mt-3">
          <a
            className="btn btn-primary text-white"
            href="https://docs.google.com/spreadsheets/d/1nkOpL4L6J9mDw2tLaezeO8KZnXxwhauCed1JG5u6bq8/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Calendar URL
          </a>
          <button className="btn btn-warning" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add Single Holiday'}
          </button>
          <button className="btn btn-primary text-white" onClick={handleSyncCalendar}>
            Update Calendar
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4">
            {['countryName', 'calendarYear', 'holidayName', 'holidayDate'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field === 'calendarYear'
                    ? 'Calendar Year'
                    : field === 'holidayDate'
                    ? 'Holiday Date'
                    : field === 'holidayName'
                    ? 'Holiday Name'
                    : 'Country Name'}
                </label>
                <input
                  type={field === 'calendarYear' ? 'number' : field === 'holidayDate' ? 'date' : 'text'}
                  name={field}
                  className="form-control"
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-success">Add Holiday</button>
          </form>
        )}

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
              {holidays.map((h) => (
                <tr key={h.holidayId}>
                  <td>{h.holidayId}</td>
                  <td>{h.countryName}</td>
                  <td>{h.calendarYear}</td>
                  <td>{h.holidayDate}</td>
                  <td>{h.holidayDay}</td>
                  <td>{h.holidayName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AddCountryCalendar;
