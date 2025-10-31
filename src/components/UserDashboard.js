import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userId = parseInt(sessionStorage.getItem('userId'), 10);

    if (token && userId) {
      getUserDetails(userId)
        .then((res) => {
          console.log('Profile response:', res.data); // ✅ Check this in console
          if (res.data && typeof res.data === 'object') {
            setProfile(res.data);
          } else {
            console.warn('Empty or invalid profile data');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err);
          setLoading(false);
        });
    } else {
      console.warn('Missing token or userId');
      setLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  if (loading) {
    return <div className="container mt-5">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="container mt-5">Profile not found.</div>;
  }

  return (
    <>
      <div className="navbar">
        <h1>Smart Leave Manager</h1>
        <div>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/leave-calendar">Calendar</Link>
          <Link to="/leave-balance">Balance</Link>
          <Link to="/leave-requests">Requests</Link>
          <button onClick={handleSignOut} className="btn btn-link text-white">Sign Out</button>
        </div>
      </div>

      <div className="container mt-5">
        <h2>User Dashboard</h2>

        <div className="card p-4 mt-4 shadow-sm">
          <h5 className="mb-3">👤 Profile Summary</h5>
          <p><strong>Full Name:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Username:</strong> {profile.userName}</p>
          <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Country:</strong> {profile.countryName}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Role:</strong> {profile.role?.roleName || profile.userRole}</p>
          <p><strong>Role Description:</strong> {profile.role?.description}</p>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
