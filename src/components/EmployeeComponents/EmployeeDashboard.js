import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav, Button, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import logowhite from '../../images/logowhite.png';
import AddCoursePage from './AddCoursePage';
import LearningBucket from './LearningBucket';
import SkillsDisplay from './SkillsDisplay';
import CertificationsPage from './CertificationsPage';
import GamificationProgress from '../AdminComponents/GamificationProgress';
import ProgressBar from 'react-bootstrap/ProgressBar'; // For progress bar
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2'; // For graph

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Tooltip, Legend);

const EmployeeDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchAvailableCourses();
    fetchUserProfile();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const getLevel = (points) => {
    // Example logic to determine level based on points
    if (points < 50) return 'Beginner';
    else if (points < 100) return 'Intermediate';
    else if (points < 150) return 'Advanced';
    return 'Expert';
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
      alert('Course added to your learning bucket successfully!');
    } catch (error) {
      console.error('Error adding course to learning bucket:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Sample data for graph; this should be replaced with actual data from your backend
  const graphData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Courses Completed',
        data: [5, 10, 15, 20, 25],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
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
          <Nav.Link onClick={() => handlePageChange('dashboard')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Dashboard' : <i className="fa-solid fa-chart-line"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('addCourse')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Add to Learning' : <i className="fa-solid fa-plus-circle"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('learningBucket')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Learning Bucket' : <i className="fa-solid fa-book"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('skills')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Skills' : <i className="fa-solid fa-star"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('certifications')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Certifications' : <i className="fa-solid fa-certificate"></i>}
          </Nav.Link>
          {sidebarExpanded && (
            <div style={{ marginTop: '30px', color: 'white' }}>
              <h6>Gamification</h6>
              <GamificationProgress points={user ? user.points : 0} />
            </div>
          )}
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
          {user && (
            <Card className="mb-4" style={{ display: 'flex', flexDirection: 'row', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', alignItems: 'center' }}>
              <Image 
                src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} 
                roundedCircle 
                style={{ width: '60px', height: '60px', marginRight: '15px' }} 
                alt="User Thumbnail"
              />
              <div>
                <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {user.firstName} {user.lastName}
                </Card.Title>
                <Card.Text style={{ marginBottom: '5px' }}>
                  <strong>Employee ID:</strong> {user.employeeID} <br />
                  <strong>Department:</strong> {user.department} <br />
                  <strong>Designation:</strong> {user.designation} <br />
                  <strong>Points:</strong> {user.points} <br />
                </Card.Text>
              </div>
            </Card>
          )}

          {currentPage === 'dashboard' && (
            <div>
              <h3>Welcome to your Employee Dashboard!</h3>
              <p>Your gamification level: {user ? getLevel(user.points) : 'N/A'}</p>
              {/* Display progress bar for points */}
              <ProgressBar now={user ? user.points : 0} max={200} label={`${user ? user.points : 0} Points`} />
              
              {/* Graph displaying courses completed */}
              <h4>Courses Completed Over Time</h4>
              <Line data={graphData} options={{ responsive: true }} />
            </div>
          )}
          {currentPage === 'addCourse' && (
            <AddCoursePage availableCourses={availableCourses} addToLearningBucket={addToLearningBucket} />
          )}
          {currentPage === 'learningBucket' && <LearningBucket />}
          {currentPage === 'skills' && <SkillsDisplay />}
          {currentPage === 'certifications' && <CertificationsPage />}
        </Container>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
