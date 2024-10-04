import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, ListGroup } from 'react-bootstrap';

const SkillsDisplay = () => {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]); // State to store user's skills

  useEffect(() => {
    fetchSkills();
    fetchUserSkills(); // Fetch user skills when component mounts
  }, []);

  const fetchSkills = async () => {
    try {
      const token = Cookies.get('token'); // Retrieve the token correctly.
      const response = await axios.get('http://localhost:3000/api/user/skillsdep', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(response.data); // Assuming response.data is an array of skill objects
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const token = Cookies.get('token'); // Retrieve the token correctly.
      const response = await axios.get('http://localhost:3000/api/user/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserSkills(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  // Group skills by department
  const groupedSkills = skills.reduce((acc, skill) => {
    const departmentId = skill.department; // Assuming the department is included in the skill object
    if (!acc[departmentId]) {
      acc[departmentId] = { skills: [], userSkills: [] }; // Initialize department group
    }
    acc[departmentId].skills.push(skill);
    return acc;
  }, {});

  // Group user's skills by department
  userSkills.forEach(userSkill => {
    const departmentId = userSkill.department; // Assuming userSkill has a department
    if (groupedSkills[departmentId]) {
      groupedSkills[departmentId].userSkills.push(userSkill);
    } else {
      groupedSkills[departmentId] = { skills: [], userSkills: [userSkill] }; // Initialize if not present
    }
  });

  return (
    <Card>
      <Card.Header as="h5">Expected Skills for Your Department</Card.Header>
      <ListGroup variant="flush">
        {Object.keys(groupedSkills).map((departmentId) => (
          <div key={departmentId}>
            <h6>{departmentId}</h6> {/* Replace with the actual department name if available */}
            {groupedSkills[departmentId].skills.length > 0 ? (
              groupedSkills[departmentId].skills.map((skill) => (
                <ListGroup.Item key={skill._id}>
                  <strong>{skill.name}</strong> {/* Display the skill name */}
                  {/* Optionally display other properties if needed */}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No expected skills available for this department.</ListGroup.Item>
            )}
            <h6>User Skills:</h6>
            <ListGroup>
              {userSkills.length > 0 ? (
                userSkills.map((userSkill, index) => (
                  <ListGroup.Item key={index}> {/* Using index as key for simple strings */}
                    {userSkill} {/* Display the user skill */}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No user skills available.</ListGroup.Item>
              )}
            </ListGroup>
            
            
          </div>
        ))}
      </ListGroup>
    </Card>
  );
};

export default SkillsDisplay;
