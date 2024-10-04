import React, { useEffect, useState } from 'react';
import { Container, Alert, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificationLink, setCertificationLink] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [section, setSection] = useState('Course');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/certifications', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setCertifications(response.data);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      setErrorMessage('Failed to load certifications.');
    }
  };

  const handleUploadCertificate = async (e) => {
    e.preventDefault();

    if (!certificateImage || !certificationLink || !selectedCourse) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('certificateImage', certificateImage);
    formData.append('certificationLink', certificationLink);
    formData.append('courseId', selectedCourse);
    formData.append('section', section);

    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/user/certifications', formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Certification uploaded successfully!');
      resetForm();
      fetchCertifications();  // Refresh certifications after upload
    } catch (error) {
      console.error('Error uploading certification:', error);
      setErrorMessage('Failed to upload certification.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCertificateImage(null);
    setCertificationLink('');
    setSelectedCourse('');
    setSection('Course');
    setErrorMessage('');
  };

  return (
    <Container className="mt-4">
      <h4>Your Certifications</h4>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleUploadCertificate} className="mb-4">
        <Form.Group controlId="courseSelect">
          <Form.Label>Select Course</Form.Label>
          <Form.Control as="select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            <option value="">Select a course</option>
            {certifications.map(cert => (
              <option key={cert.courseId._id} value={cert.courseId._id}>{cert.courseId.course}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="sectionSelect">
          <Form.Label>Select Section</Form.Label>
          <Form.Control as="select" value={section} onChange={(e) => setSection(e.target.value)} required>
            <option value="Course">Course</option>
            <option value="Professional Certificate">Professional Certificate</option>
            <option value="Guided Project">Guided Project</option>
            <option value="Specialization">Specialization</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="certificateImage">
          <Form.Label>Upload Certificate Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setCertificateImage(e.target.files[0])} required />
        </Form.Group>

        <Form.Group controlId="certificationLink">
          <Form.Label>Certification Link</Form.Label>
          <Form.Control type="url" value={certificationLink} onChange={(e) => setCertificationLink(e.target.value)} required />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          Upload Certification
        </Button>
        {loading && <p>Uploading...</p>}
      </Form>

      <h5 className="mt-4">Uploaded Certifications</h5>
      {certifications.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Course</th>
              <th>Section</th>
              <th>Certification Link</th>
              <th>Certificate Image</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map(cert => (
              <tr key={cert._id}>
                <td>{cert.courseId.course}</td>
                <td>{cert.section}</td>
                <td>
                  <a href={cert.certificationLink} target="_blank" rel="noopener noreferrer">View Certification</a>
                </td>
                <td>
                  <img src={cert.certificateImage} alt="Certificate" style={{ maxWidth: '100px', height: 'auto' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No certifications uploaded yet.</p>
      )}
    </Container>
  );
};

export default CertificationsPage;
