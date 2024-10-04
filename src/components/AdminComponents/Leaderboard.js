
// src/components/Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get('http://localhost:3000/api/admin/leaderboard');
      setLeaderboard(res.data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h3>Department Leaderboard</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Department</TableCell>
            <TableCell>Total Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map(dept => (
            <TableRow key={dept._id}>
              <TableCell>{dept._id}</TableCell>
              <TableCell>{dept.totalScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
