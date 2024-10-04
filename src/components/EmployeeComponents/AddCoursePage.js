// AddCoursePage.js
import React, { useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';

const AddCoursePage = ({ availableCourses, addToLearningBucket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCertificateType, setSelectedCertificateType] = useState('');

  // Filter courses based on search term, level, and certificate type
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearchTerm = course.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    const matchesCertificateType = selectedCertificateType ? course.certificateType === selectedCertificateType : true;
    return matchesSearchTerm && matchesLevel && matchesCertificateType;
  });

  // Update search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Update selected level
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  // Update selected certificate type
  const handleCertificateTypeChange = (e) => {
    setSelectedCertificateType(e.target.value);
  };

  return (
    <div>
      <h4>Select a Course to Add</h4>

      {/* Filter Controls */}
      <Form>
        <Form.Group controlId="search">
          <Form.Label>Search Courses</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by course name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>
        
        <Form.Group controlId="level">
          <Form.Label>Filter by Level</Form.Label>
          <Form.Control as="select" value={selectedLevel} onChange={handleLevelChange}>
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate ">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="certificateType">
          <Form.Label>Filter by Certificate Type</Form.Label>
          <Form.Control as="select" value={selectedCertificateType} onChange={handleCertificateTypeChange}>
            <option value="">All Certificate Types</option>
            <option value=" Professional Certificate ">Professional Certificate</option>
            <option value=" Course ">Course</option>
            <option value=" Specialization ">Specialization</option>
            <option value=" Guided Project ">Guided Project</option>
          </Form.Control>
        </Form.Group>
      </Form>

      <Row className="mt-3">
        {filteredCourses.map((course) => (
          <Col md={4} key={course._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{course.course}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Partner: {course.partner}</Card.Subtitle>
                <Card.Text>
                  <strong>Skills:</strong> {course.skills.join(', ')}<br />
                  <strong>Rating:</strong> {course.rating}<br />
                  <strong>Level:</strong> {course.level}<br />
                  <strong>Duration:</strong> {course.duration}<br />
                  <strong>Certificate Type:</strong> {course.certificateType}<br />
                </Card.Text>
                <Button variant="primary" onClick={() => addToLearningBucket(course)}>
                  Add to Learning
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AddCoursePage;
