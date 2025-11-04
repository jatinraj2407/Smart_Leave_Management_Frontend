import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';
import { getHolidayCalendar } from '../services/api.js';

function LeaveCalendar() {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    let abort = false;
    const userId = sessionStorage.getItem('userId');

    (async () => {
      try {
        setLoading(true);
        if (!userId) throw new Error('Missing userId in sessionStorage');
        const response = await getHolidayCalendar(userId);
        if (!abort) setHolidays(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        if (!abort) setError(e.message || 'Failed to load holidays');
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, []);

  const normalizedHolidays = useMemo(() => {
    return (holidays || []).map((h, idx) => ({
      id: idx + 1,
      name: h.holidayName,
      date: h.holidayDate,
      day: h.hoilydayDay, // Typo preserved from backend
      country: h.countryName,
    }));
  }, [holidays]);

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="container mt-5">
        <h2 className="text-center mb-4">🗓️ India Holiday Calendar – 2025</h2>

        {loading && (
          <div className="alert alert-info text-center" role="alert">
            Loading holidays…
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && (
          <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">All Holidays</h5>
              <small className="text-muted">{normalizedHolidays.length} records</small>
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th style={{ width: '140px' }}>Date</th>
                  <th style={{ width: '140px' }}>Day</th>
                  <th>Holiday Description</th>
                </tr>
              </thead>
              <tbody>
                {normalizedHolidays.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.date}</td>
                    <td>{h.day}</td>
                    <td>{h.name}</td>
                  </tr>
                ))}
                {normalizedHolidays.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No holidays available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default LeaveCalendar;
