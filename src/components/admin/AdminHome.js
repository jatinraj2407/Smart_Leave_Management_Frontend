import React, { useEffect, useState } from 'react';
import { getAdminDetails, updateAdminDetails } from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const adminId = sessionStorage.getItem('userId');

  const fetchAdmin = async () => {
    try {
      const res = await getAdminDetails(adminId);
      setAdmin(res.data);
      setFormData({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        email: res.data.email || '',
        phoneNumber: res.data.phoneNumber || '',
        address: res.data.address || ''
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch admin details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminId) {
      setMessage('Missing authentication. Please log in again.');
      setLoading(false);
      return;
    }
    fetchAdmin();
  }, [adminId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedAdmin = {
        ...admin,
        ...formData
      };
      await updateAdminDetails(adminId, updatedAdmin);
      await fetchAdmin(); // Refresh profile after update
      setMessage('Profile updated successfully!');
      document.getElementById('closeModalTrigger')?.click();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || 'Failed to update profile.');
    }
  };

  if (loading) return <div className="container mt-5">Loading admin details...</div>;
  if (message && !admin) return <div className="container mt-5 alert alert-danger">{message}</div>;
  if (!admin) return <div className="container mt-5">No admin data found.</div>;

  return (
    <>
      {message && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className="toast show text-bg-info border-0">
            <div className="d-flex">
              <div className="toast-body">{message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setMessage('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>👤 Admin Profile</h3>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#editAdminModal"
          >
            Edit Profile
          </button>
        </div>

        <div className="card p-4 shadow-sm">
          <p><strong>Full Name:</strong> {admin.firstName} {admin.lastName}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Username:</strong> {admin.userName}</p>
          <p><strong>Phone Number:</strong> {admin.phoneNumber}</p>
          <p><strong>Address:</strong> {admin.address}</p>
          <p><strong>Gender:</strong> {admin.gender}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="editAdminModal" tabIndex="-1" aria-labelledby="editAdminModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleUpdate}>
              <div className="modal-header">
                <h5 className="modal-title" id="editAdminModalLabel">✏️ Edit Profile</h5>
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary d-none" id="closeModalTrigger" data-bs-dismiss="modal"></button>
                <button type="submit" className="btn btn-success">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
