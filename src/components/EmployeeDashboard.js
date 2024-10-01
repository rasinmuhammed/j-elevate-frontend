// src/components/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress, Button } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EmployeeDashboard = () => {
  const [progressData, setProgressData] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch employee performance data (charts and certification progress)
    const fetchData = async () => {
      const res = await axios.get('http://localhost:3000/api/employee/dashboard-data');
      setProgressData(res.data.performanceData);
      setCertifications(res.data.certifications);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}>
        <EmployeeSidebar />
      </div>

      <div style={{ flexGrow: 1 }}>
        <TopNavbar />

        <Grid container spacing={3} style={{ padding: '20px' }}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Course Completion Progress</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={progressData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Skills and Certifications</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={certifications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Learning Recommendations</Typography>
              {/* Placeholder for the machine learning-based recommendations */}
              <Typography variant="body2">Your personalized learning recommendations will appear here based on your skills and performance.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Ongoing Certifications</Typography>
              {certifications.map((cert) => (
                <div key={cert.name} style={{ margin: '10px 0' }}>
                  <Typography variant="body2">{cert.name}</Typography>
                  <CircularProgress variant="determinate" value={cert.progress} />
                </div>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
