import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import logowhite from '../../images/logowhite.png';
import AddCoursePage from './AddCoursePage';
import LearningBucket from './LearningBucket';
import SkillsDisplay from './SkillsDisplay'; // Import SkillsDisplay component
import CertificationsPage from './CertificationsPage';

const EmployeeDashboard = () => {
  const [showCertifications, setShowCertifications] = useState(false);
  const [showAddCoursePage, setShowAddCoursePage] = useState(false);
  const [showLearningBucket, setShowLearningBucket] = useState(false);
  const [showSkills, setShowSkills] = useState(false); // New state for skills
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [user, setUser] = useState(null); // State to store user details

  useEffect(() => {
    fetchAvailableCourses();
    fetchUserProfile(); // Fetch user profile data on mount
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/profile', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const addToLearningBucket = async (courseId) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/user/add-course',
        { courseId },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      console.log(response.data.message);
      alert('Course added to your learning bucket successfully!');
    } catch (error) {
      console.error('Error adding course to learning bucket:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleAddCoursePageOpen = () => {
    setShowAddCoursePage(true);
    setShowLearningBucket(false);
    setShowSkills(false); // Close Skills page when adding a course
  };
  
  const handleCertificationsPageOpen = () => {
    setShowCertifications(true);
    setShowAddCoursePage(false);
    setShowLearningBucket(false);
    setShowSkills(false);
  };

  const handleLearningBucketPageOpen = () => {
    setShowLearningBucket(true);
    setShowAddCoursePage(false);
    setShowSkills(false); // Close Skills page when viewing Learning Bucket
  };

  // New function to handle opening the Skills page
  const handleSkillsPageOpen = () => {
    setShowSkills(true);
    setShowAddCoursePage(false); // Close Add Course Page when viewing Skills
    setShowLearningBucket(false); // Close Learning Bucket when viewing Skills
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      <div style={{
          width: sidebarExpanded ? '250px' : '60px',
          transition: 'width 0.3s',
          background: 'linear-gradient(180deg, #350ca3, #6d259f, #f05e95)',
          padding: sidebarExpanded ? '20px' : '10px',
          overflow: 'hidden',
        }}
      >
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          style={{ marginBottom: '20px', width: '100%' }}
        >
          {sidebarExpanded ? 'Menu' : <i className="fa-solid fa-bars"></i>}
        </Button>
        <Nav className="flex-column">
          <Nav.Link onClick={handleAddCoursePageOpen} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Add to Learning' : <i className="fa-solid fa-plus-circle"></i>}
          </Nav.Link>
          <Nav.Link onClick={handleLearningBucketPageOpen} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Learning Bucket' : <i className="fa-solid fa-book"></i>}
          </Nav.Link>
          <Nav.Link onClick={handleSkillsPageOpen} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Skills' : <i className="fa-solid fa-star"></i>}
          </Nav.Link>
          <Nav.Link onClick={handleCertificationsPageOpen} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Certifications' : <i className="fa-solid fa-certificate"></i>}
          </Nav.Link>
        </Nav>
      </div>

      <div style={{ flex: 1 }}>
        <Navbar expand="lg" style={{ background: '#25195f' }}>
          <Container>
            <Navbar.Brand href="#" style={{ color: 'white' }}>
              <img src={logowhite} alt="J Elevate Logo" className="dashboard-logo" />
            </Navbar.Brand>
            <Nav className="ml-auto">
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Container>
        </Navbar>

        <Container className="dashboard-container mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', padding: '20px' }}>
          {/* User Information Card */}
          {user && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                <Card.Text>
                  Employee ID: {user.employeeID} <br />
                  Points: {user.points} <br />
                 
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          {/* Conditional Rendering */}
          {showAddCoursePage && <AddCoursePage availableCourses={availableCourses} addToLearningBucket={addToLearningBucket} />}
          {showLearningBucket && <LearningBucket />}
          {showSkills && <SkillsDisplay />}
          {showCertifications && <CertificationsPage />} {/* Render Certifications Page */}
        </Container>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
