// src/components/CertificationApproval.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';

const CertificationApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch pending requests
    const fetchRequests = async () => {
      const res = await axios.get('http://localhost:3000/api/admin/pending-requests');
      setRequests(res.data);
    };

    fetchRequests();
  }, []);

  const handleApproval = async (requestId, approve) => {
    await axios.post('http://localhost:3000/api/admin/approve-certification', { requestId, approve });
    setRequests(requests.filter(req => req._id !== requestId)); // Remove approved/rejected request from UI
  };

  return (
    <div>
      <h3>Pending Certification Approvals</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Certification</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map(req => (
            <TableRow key={req._id}>
              <TableCell>{req.employee.name}</TableCell>
              <TableCell>{req.certificationName}</TableCell>
              <TableCell>{req.score}</TableCell>
              <TableCell>
                <Button onClick={() => handleApproval(req._id, true)}>Approve</Button>
                <Button onClick={() => handleApproval(req._id, false)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CertificationApproval;
