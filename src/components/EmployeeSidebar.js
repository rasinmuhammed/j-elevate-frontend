// src/components/EmployeeSidebar.js
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Book, Verified, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const EmployeeSidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#f5f5f5', height: '100vh' }}>
      <List>
        <ListItem button component={Link} to="/employee/dashboard">
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/employee/certifications">
          <ListItemIcon>
            <Verified />
          </ListItemIcon>
          <ListItemText primary="Approved Certifications" />
        </ListItem>
        <ListItem button component={Link} to="/employee/add-certification">
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add Certification" />
        </ListItem>
        <ListItem button component={Link} to="/employee/courses">
          <ListItemIcon>
            <Book />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </List>
    </div>
  );
};

export default EmployeeSidebar;
