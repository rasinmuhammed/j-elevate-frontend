import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const CertificationApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch pending requests
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/pending-requests', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        });
        setRequests(res.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleApproval = async (requestId, approve) => {
    try {
      await axios.post(
        'http://localhost:3000/api/admin/approve-certification',
        { requestId, approve },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      // Remove approved/rejected request from UI
      setRequests((prevRequests) =>
        prevRequests.filter(req => req._id !== requestId)
      );
    } catch (error) {
      console.error('Error approving request:', error);
    }
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
