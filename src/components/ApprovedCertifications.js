// src/components/ApprovedCertifications.js
import React, { useEffect, useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const ApprovedCertifications = () => {
  const [approvedCertifications, setApprovedCertifications] = useState([]);

  useEffect(() => {
    // Fetch approved certifications from API
    const fetchCertifications = async () => {
      const res = await axios.get('http://localhost:3000/api/employee/approved-certifications');
      setApprovedCertifications(res.data);
    };
    fetchCertifications();
  }, []);

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Approved Certifications</Typography>
      <List>
        {approvedCertifications.map((cert) => (
          <ListItem key={cert.id}>
            <ListItemText primary={cert.name} secondary={cert.description} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ApprovedCertifications;
