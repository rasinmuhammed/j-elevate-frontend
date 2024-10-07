import React, { useEffect, useState } from 'react';
import { Container, Alert, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CertificationsPage.css';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificationLink, setCertificationLink] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [section, setSection] = useState('Course');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterVerified, setFilterVerified] = useState(false);

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
      fetchCertifications();
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

  // Filter and sort certifications
  const filteredCertifications = certifications
    .filter(cert => (
      cert.courseId.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificationLink.toLowerCase().includes(searchQuery.toLowerCase())
    ))
    .filter(cert => !filterVerified || cert.isVerified)
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'course') {
        comparison = a.courseId.course.localeCompare(b.courseId.course);
      } else if (sortBy === 'completionDate') {
        comparison = new Date(a.completionDate) - new Date(b.completionDate);
      } else if (sortBy === 'approved') {
        comparison = a.isVerified === b.isVerified ? 0 : a.isVerified ? -1 : 1;
      } else {
        comparison = new Date(b.createdAt) - new Date(a.createdAt);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
  };

  return (
    <Container className="mt-4">
      <h4>Your Certifications</h4>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleUploadCertificate} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCertificateImage">
              <Form.Label>Certificate Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setCertificateImage(e.target.files[0])}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCertificationLink">
              <Form.Label>Certification Link</Form.Label>
              <Form.Control
                type="text"
                value={certificationLink}
                onChange={(e) => setCertificationLink(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={4}>
            <Form.Group controlId="formSection">
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Certification'}
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Check
            type="checkbox"
            label="Show Verified Only"
            checked={filterVerified}
            onChange={(e) => setFilterVerified(e.target.checked)}
          />
        </Col>
      </Row>

      <h5 className="mt-4">Uploaded Certifications</h5>
      {filteredCertifications.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('course')} style={{ cursor: 'pointer' }}>
                Course {sortBy === 'course' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('certificateType')} style={{ cursor: 'pointer' }}>
                Certificate Type {sortBy === 'certificateType' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('section')} style={{ cursor: 'pointer' }}>
                Section {sortBy === 'section' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('completionDate')} style={{ cursor: 'pointer' }}>
                Completion Date {sortBy === 'completionDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('approved')} style={{ cursor: 'pointer' }}>
                Approved {sortBy === 'approved' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertifications.map(cert => (
              <tr key={cert._id}>
                <td>{cert.courseId.course}</td>
                <td>{cert.courseId.certificateType}</td> {/* Displaying the certificate type */}
                <td>{cert.section}</td>
                <td>{new Date(cert.completionDate).toLocaleDateString()}</td>
                <td>{cert.isApproved ? 'Yes' : 'No'}</td>
                <td>
                  <a href={cert.certificationLink} target="_blank" rel="noopener noreferrer">
                    <i className="fa-solid fa-eye"></i> View
                  </a>
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
