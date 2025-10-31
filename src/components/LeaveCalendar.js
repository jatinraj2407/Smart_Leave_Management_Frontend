import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

function LeaveCalendar() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState(null);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  const regions = {
    South: ['Chennai', 'Coimbatore', 'Kochi', 'Bangalore', 'Mangalore', 'Hyderabad'],
    West: ['Mumbai', 'Pune', 'Ahmedabad'],
    Central: ['Indore'],
    North: ['Gurgaon', 'Noida'],
    East: ['Kolkata', 'Bhubaneshwar'],
  };

  const holidays = [
    { id: 1, name: "New Year's Day", date: '2026-01-01', day: 'THURSDAY', regions: 'All' },
    { id: 2, name: 'Makar Sankranti', date: '2026-01-14', day: 'WEDNESDAY', regions: ['South'] },
    { id: 3, name: 'Parakram Diwas', date: '2026-01-23', day: 'FRIDAY', regions: ['East'] },
    { id: 4, name: 'Republic Day', date: '2026-01-26', day: 'MONDAY', regions: 'All' },
    { id: 5, name: 'Holi', date: '2026-03-03', day: 'TUESDAY', regions: ['West', 'Central', 'North', 'East'] },
    { id: 6, name: 'Mahavir Jayanti', date: '2026-03-31', day: 'TUESDAY', regions: 'All' },
    { id: 7, name: 'Easter Monday', date: '2026-04-06', day: 'MONDAY', regions: ['South'] },
    { id: 8, name: 'Ambedkar Jayanti', date: '2026-04-14', day: 'TUESDAY', regions: 'All' },
    { id: 9, name: 'Ram Navami', date: '2026-04-17', day: 'FRIDAY', regions: 'All' },
    { id: 10, name: 'Labour Day', date: '2026-05-01', day: 'FRIDAY', regions: 'All' },
    { id: 11, name: 'Buddha Purnima', date: '2026-05-25', day: 'MONDAY', regions: 'All' },
    { id: 12, name: 'Rath Yatra', date: '2026-07-06', day: 'MONDAY', regions: ['East'] },
    { id: 13, name: 'Bakrid / Eid al-Adha', date: '2026-07-21', day: 'TUESDAY', regions: 'All' },
    { id: 14, name: 'Independence Day', date: '2026-08-15', day: 'SATURDAY', regions: 'All' },
    { id: 15, name: 'Janmashtami', date: '2026-08-28', day: 'FRIDAY', regions: 'All' },
    { id: 16, name: 'Hindi Diwas', date: '2026-09-14', day: 'MONDAY', regions: ['Central', 'North'] },
    { id: 17, name: 'Gandhi Jayanti', date: '2026-10-02', day: 'FRIDAY', regions: 'All' },
    { id: 18, name: 'Navratri Begins', date: '2026-10-11', day: 'SUNDAY', regions: ['Central', 'West'] },
    { id: 19, name: 'Dussehra', date: '2026-10-20', day: 'TUESDAY', regions: 'All' },
    { id: 20, name: 'Valmiki Jayanti', date: '2026-10-26', day: 'MONDAY', regions: ['North'] },
    { id: 21, name: 'Karwa Chauth', date: '2026-10-29', day: 'THURSDAY', regions: ['North'] },
    { id: 22, name: 'Diwali', date: '2026-11-09', day: 'MONDAY', regions: 'All' },
    { id: 23, name: "Children's Day", date: '2026-11-14', day: 'SATURDAY', regions: 'All' },
    { id: 24, name: 'Guru Nanak Jayanti', date: '2026-11-24', day: 'TUESDAY', regions: 'All' },
    { id: 25, name: 'Constitution Day', date: '2026-11-26', day: 'THURSDAY', regions: 'All' },
    { id: 26, name: 'Christmas Day', date: '2026-12-25', day: 'FRIDAY', regions: 'All' },
  ];

  const getRegionHolidays = (region) => {
    return holidays.filter((holiday) => {
      if (holiday.regions === 'All') return true;
      return holiday.regions.includes(region);
    });
  };

  return (
    <>
      {/* ✅ Navbar */}
      <div style={{
        backgroundColor: '#00796b',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Smart Leave Manager</h1>
        <div>
          <Link to="/user-dashboard" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/apply-leave" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Apply Leave</Link>
          <Link to="/leave-balance" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Balance</Link>
          <Link to="/leave-requests" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Requests</Link>
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* ✅ Hero Section */}
      <div style={{ maxWidth: '900px', margin: '2rem auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>🗓️ India Holiday Calendar – 2026</h2>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>Click a region below to view holidays and applicable cities.</p>
      </div>

      {/* ✅ Region Cards */}
      <div style={{ maxWidth: '900px', margin: 'auto' }}>
        <div className="row g-4">
          {Object.entries(regions).map(([region, cities]) => (
            <div key={region} className="col-md-4 mb-4">
              <div
                onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                style={{
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: activeRegion === region ? '#f0f8ff' : 'white',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h5 style={{ color: '#00796b' }}>{region} Region</h5>
                <p><strong>Cities:</strong></p>
                <ul style={{ paddingLeft: '1rem', marginBottom: 0 }}>
                  {cities.map((city, i) => (
                    <li key={i}>{city}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Holiday Table */}
      {activeRegion && (
        <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #ddd'
          }}>
            <table className="table table-bordered table-hover">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Holiday Description</th>
                </tr>
              </thead>
              <tbody>
                {getRegionHolidays(activeRegion).map((holiday) => (
                  <tr key={holiday.id}>
                    <td>{holiday.id}</td>
                    <td>{holiday.date}</td>
                    <td>{holiday.day}</td>
                    <td>{holiday.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default LeaveCalendar;
