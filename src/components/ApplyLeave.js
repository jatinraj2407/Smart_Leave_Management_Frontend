import React, { useState } from 'react';
import { applyLeave } from '../services/api';

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const userId = 1;

  const handleSubmit = async () => {
    try {
      await applyLeave(userId, { leaveType, startDate, endDate, comments });
      alert('Leave applied successfully!');
    } catch {
      alert('Failed to apply leave');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Apply Leave</h2>
      <select onChange={(e) => setLeaveType(e.target.value)}>
        <option value="">Select Leave Type</option>
        <option value="SICK_LEAVE">Sick Leave</option>
        <option value="EARNED_LEAVE">Earned Leave</option>
        <option value="CASUAL_LEAVE">Casual Leave</option>
        <option value="PATERNITY_LEAVE">Paternity Leave</option>
        <option value="MATERNITY_LEAVE">Maternity Leave</option>
      </select>
      <input type="date" onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" onChange={(e) => setEndDate(e.target.value)} />
      <textarea placeholder="Comments" onChange={(e) => setComments(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default ApplyLeave;
