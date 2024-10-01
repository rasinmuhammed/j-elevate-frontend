import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import CSVReader from 'react-csv-reader';
import axios from 'axios';
import { saveAs } from 'file-saver';

const BulkUpload = () => {
  const [csvData, setCsvData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (data) => {
    if (!data || data.length === 0) {
      alert('The CSV file is empty or invalid.');
      return;
    }

    const formattedData = data.map((row) => row.map((cell) => cell.trim()));
    const dataWithoutHeader = formattedData
      .slice(1)
      .filter((row) => row.length > 0 && row.some((cell) => cell));

    if (dataWithoutHeader.length === 0) {
      alert('No valid data found in the CSV.');
      return; // Exit early if no valid data
    }

    setCsvData(dataWithoutHeader);
  };

  const handleSubmit = async () => {
    if (!csvData || csvData.length === 0) {
      alert('Please upload a valid CSV file.');
      return;
    }

    setIsSubmitting(true);

    const uniqueEmployees = {};
    const employeeCredentials = [];

    for (let row of csvData) {
      const [firstName, lastName, department, designation] = row;

      if (!firstName || !lastName) {
        alert('First Name and Last Name cannot be empty.');
        setIsSubmitting(false);
        return;
      }

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;

      if (!uniqueEmployees[email]) {
        uniqueEmployees[email] = true; // Ensure unique email
        const employeeID = `EMP${Date.now()}${Math.floor(Math.random() * 100)}`; // Generate unique ID
        const password = Math.random().toString(36).slice(-8); // Generate random password

        const newEmployee = {
          firstName,
          lastName,
          email,
          password,
          employeeID,
          department,
          designation,
        };

        employeeCredentials.push(newEmployee);
      }
    }

    try {
      const res = await axios.post('http://localhost:3000/api/admin/bulk-upload', {
        employees: employeeCredentials,
      });

      if (res.status === 200 || res.status === 201) { // Check for successful upload
        alert('Employees successfully uploaded');

        // Prepare CSV content for download
        const csvContent = 'Employee ID,First Name,Last Name,Email,Password,Department,Designation\n' +
          employeeCredentials
            .map((emp) =>
              `${emp.employeeID},${emp.firstName},${emp.lastName},${emp.email},${emp.password},${emp.department},${emp.designation}`
            )
            .join('\n');

        // Create a Blob and initiate download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `bulk_upload_credentials.csv`); // Save the CSV file
      } else {
        alert('Error uploading employees errorpoint1'); // Handle non-success response
      }
    } catch (err) {
      console.error('Error uploading employees:', err);
      alert('Error uploading employees errorpoint2'); // Handle Axios error
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h4>Bulk Upload Employees</h4>
          <CSVReader onFileLoaded={handleFileUpload} parserOptions={{ delimiter: ',' }} />
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Employees'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BulkUpload;
