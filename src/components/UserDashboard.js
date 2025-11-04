import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import {
  getUserDetails,
  updateUserDetails
} from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/UserDashboard.css';

function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    countryName: '',
    description: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userId = parseInt(sessionStorage.getItem('userId'), 10);

    console.log('userId:', userId);
    console.log('token:', token);

    if (!token || !userId || isNaN(userId)) {
      alert('Session expired or invalid. Please log in again.');
      sessionStorage.clear();
      navigate('/user-login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getUserDetails(userId);
        console.log('User profile response:', res.data);

        if (!res?.data || typeof res.data !== 'object' || !res.data.userId) {
          throw new Error('Invalid user data');
        }

        const rawRole = res.data.userRole || res.data.role?.roleName || '';
        const normalizedRole =
          rawRole === 'HR' ? 'HR_MANAGER' :
          rawRole === 'Team_Manager' ? 'TEAM_MANAGER' :
          rawRole === 'Team_Member' ? 'TEAM_MEMBER' :
          rawRole;

        sessionStorage.setItem('userRole', normalizedRole);
        sessionStorage.setItem('role', rawRole);

        setProfile(res.data);
        setFormData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
          phoneNumber: res.data.phoneNumber || '',
          address: res.data.address || '',
          countryName: res.data.countryName || '',
          description: res.data.role?.description || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        alert('Unable to load profile. Please log in again.');
        sessionStorage.clear();
        navigate('/user-login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = parseInt(sessionStorage.getItem('userId'), 10);

      const updatedUser = {
        userId: profile.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        countryName: formData.countryName,
        gender: profile.gender,
        userName: profile.userName,
        password: profile.password || '',
        role: {
          ...profile.role,
          description: formData.description
        },
        userRole: profile.userRole,
        otp: profile.otp || 0,
        otpStatus: profile.otpStatus || 'GENERATE'
      };

      await updateUserDetails(userId, updatedUser);
      alert('Profile updated successfully!');

      setProfile({
        ...profile,
        ...formData,
        role: {
          ...profile.role,
          description: formData.description
        }
      });

      const closeBtn = document.getElementById('closeModalTrigger');
      if (closeBtn) closeBtn.click();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <div className="container mt-5">Loading profile...</div>;
  if (!profile || typeof profile !== 'object') return <div className="container mt-5">Profile not found or invalid.</div>;

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Welcome, {profile.firstName} 👋</h2>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#editProfileModal"
          >
            Edit Profile
          </button>
        </div>

        <div className="card p-4 shadow-sm">
          <h5 className="mb-3">👤 Profile Summary</h5>
          <p><strong>Full Name:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Username:</strong> {profile.userName}</p>
          <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Country:</strong> {profile.countryName}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Role:</strong> {profile.role?.roleName || profile.userRole || 'N/A'}</p>
          <p><strong>Role Description:</strong> {profile.role?.description || 'N/A'}</p>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content form-modal">
            <form onSubmit={handleUpdate}>
              <div className="modal-header">
                <h5 className="modal-title" id="editProfileModalLabel">✏️ Update Profile</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input type="text" className="form-control" value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input type="text" className="form-control" value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" className="form-control" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label>Phone Number</label>
                  <input type="text" className="form-control" value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label>Address</label>
                  <input type="text" className="form-control" value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label>Country</label>
                  <input type="text" className="form-control" value={formData.countryName}
                    onChange={(e) => setFormData({ ...formData, countryName: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label>Description</label>
                  <textarea className="form-control" rows="3" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary d-none"
                  id="closeModalTrigger"
                  data-bs-dismiss="modal"
                ></button>
                <button type="submit" className="btn btn-success">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
