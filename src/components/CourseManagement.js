import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    partner: '',
    course: '',
    skills: '',
    rating: '',
    reviewcount: '',
    level: '',
    certificatetype: '',
    duration: '',
    crediteligibility: false,
  });

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses'); // Adjust the endpoint as necessary
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCourse = async () => {
    try {
      await axios.post('/api/courses', newCourse);
      setShowModal(false);
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div>
      <h2>Course Management</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Course
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Partner</th>
            <th>Course</th>
            <th>Skills</th>
            <th>Rating</th>
            <th>Review Count</th>
            <th>Level</th>
            <th>Certificate Type</th>
            <th>Duration</th>
            <th>Credit Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.partner}</td>
              <td>{course.course}</td>
              <td>{course.skills.join(', ')}</td>
              <td>{course.rating}</td>
              <td>{course.reviewcount}</td>
              <td>{course.level}</td>
              <td>{course.certificatetype}</td>
              <td>{course.duration}</td>
              <td>{course.crediteligibility ? 'TRUE' : 'FALSE'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding new course */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPartner">
              <Form.Label>Partner</Form.Label>
              <Form.Control type="text" name="partner" value={newCourse.partner} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formCourse">
              <Form.Label>Course</Form.Label>
              <Form.Control type="text" name="course" value={newCourse.course} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formSkills">
              <Form.Label>Skills</Form.Label>
              <Form.Control type="text" name="skills" value={newCourse.skills} onChange={handleInputChange} placeholder="Comma separated values" />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="rating" value={newCourse.rating} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formReviewCount">
              <Form.Label>Review Count</Form.Label>
              <Form.Control type="number" name="reviewcount" value={newCourse.reviewcount} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formLevel">
              <Form.Label>Level</Form.Label>
              <Form.Control type="text" name="level" value={newCourse.level} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formCertificateType">
              <Form.Label>Certificate Type</Form.Label>
              <Form.Control type="text" name="certificatetype" value={newCourse.certificatetype} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="text" name="duration" value={newCourse.duration} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formCreditEligibility">
              <Form.Check type="checkbox" label="Credit Eligibility" name="crediteligibility" checked={newCourse.crediteligibility} onChange={(e) => setNewCourse((prev) => ({ ...prev, crediteligibility: e.target.checked }))} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddCourse}>Add Course</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseManagement;
