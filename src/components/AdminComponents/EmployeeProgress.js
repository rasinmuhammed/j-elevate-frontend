import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GamificationProgress from './GamificationProgress'; // Import the Gamification Progress component
import '../style.css'; // Import the CSS file for styles

const EmployeeProgress = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/employees');
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const isNameMatch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const isDepartmentMatch = selectedDepartment ? employee.department?.name === selectedDepartment : true;
      return isNameMatch && isDepartmentMatch;
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

  const handleViewDetails = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/employee/${employeeId}`);
      setSelectedEmployee(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('Error fetching employee details'); // Display error to the user
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <h3>Employee List</h3>

      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="departmentFilter">
        <Form.Control
          as="select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(department => (
            <option key={department._id} value={department.name}>{department.name}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <div className="table-scroll">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.department?.name}</td>
                <td>{employee.designation}</td>
                <td>{employee.points}</td>
                <td>
                  <Button variant="info" onClick={() => handleViewDetails(employee._id)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Employee Details */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} - Details` : 'Employee Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee ? (
            <div>
              <h5>Employee ID: {selectedEmployee._id}</h5>
              <h6>Email: {selectedEmployee.email}</h6>
              <h6>Designation: {selectedEmployee.designation}</h6>
              <h6>Role: {selectedEmployee.role}</h6>
              <h6>Skills: {selectedEmployee.skills?.length ? selectedEmployee.skills.join(', ') : 'No skills available'}</h6>
              <h6>Certifications: {selectedEmployee.certifications?.length ? selectedEmployee.certifications.join(', ') : 'No certifications available'}</h6>
              <h6>Specializations: {selectedEmployee.specializations?.length ? selectedEmployee.specializations.join(', ') : 'No specializations available'}</h6>
              <h6>Points: {selectedEmployee.points}</h6>

              <GamificationProgress points={selectedEmployee.points} /> {/* Gamification Progress Component */}

              <h6>Progress History</h6>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedEmployee.progressHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <h6>Loading employee details...</h6> // Loading state
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeProgress;
