import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Tabs, Table, Form, Button, Navbar, Row, Col, Card } from 'react-bootstrap';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [pendingReferrals, setPendingReferrals] = useState(0);
  const [pendingDoctorApprovals, setPendingDoctorApprovals] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Fetch users
    axios.get('http://localhost:4000/admin/users')
      .then(response => {
        setUsers(response.data);
        setTotalUsers(response.data.length);
      })
      .catch(error => console.error('Error fetching users:', error));

    // Fetch doctors
    axios.get('http://localhost:4000/admin/doctors')
      .then(response => {
        setDoctors(response.data);
        setPendingDoctorApprovals(response.data.filter(doc => !doc.approved).length);
      })
      .catch(error => console.error('Error fetching doctors:', error));

    // Fetch referrals
    axios.get('http://localhost:4000/admin/referrals')
      .then(response => {
        setReferrals(response.data);
        setPendingReferrals(response.data.filter(referral => !referral.acknowledged).length);
      })
      .catch(error => console.error('Error fetching referrals:', error));
  }, []);

  const handleApproveDoctor = (doctorId) => {
    axios.post(`http://localhost:4000/admin/approve-doctor/${doctorId}`)
      .then(response => {
        console.log('Doctor approved:', response.data);
        // Update doctor list
        setDoctors(doctors.map(doc => doc.id === doctorId ? { ...doc, approved: true } : doc));
        setPendingDoctorApprovals(prev => prev - 1);
      })
      .catch(error => console.error('Error approving doctor:', error));
  };

  const filteredReferrals = referrals.filter(referral => 
    (!filterEmail || referral.patientemail.includes(filterEmail)) &&
    (!filterDate || referral.createdAt.startsWith(filterDate))
  );

  const referralData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Daily Referrals',
        data: [10, 20, 30, 40, 50, 60, 70], // Replace with actual data
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const userDistributionData = {
    labels: ['Doctors', 'Patients'],
    datasets: [
      {
        data: [
          doctors.length,
          users.filter(user => user.role === 'patient').length,
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const navigate = useNavigate();

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary mb-4">
        <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Container></Container>
        <Button onClick={() => navigate('/')}>Log Out</Button>
      </Navbar>
      <Tabs defaultActiveKey="dashboard" id="admin-tabs">
        <Tab eventKey="dashboard" title="Dashboard">
          <h3>Statistics</h3>
          <Row className="mb-4">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Pending Referrals</Card.Title>
                  <Card.Text>{pendingReferrals}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Pending Doctor Approvals</Card.Title>
                  <Card.Text>{pendingDoctorApprovals}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Users</Card.Title>
                  <Card.Text>{totalUsers}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={8}>
              <Card>
                <Card.Body>
                  <Card.Title>Daily Referrals</Card.Title>
                  <Line data={referralData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>User Distribution</Card.Title>
                  <Pie data={userDistributionData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="users" title="Users">
          <h3>All Users</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="doctors" title="Doctors">
          <h3>Approve Doctors</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialty</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.approved ? 'Yes' : 'No'}</td>
                  <td>
                    {!doctor.approved && (
                      <Button 
                        variant="primary" 
                        onClick={() => handleApproveDoctor(doctor.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="referrals" title="Referrals">
          <h3>All Referrals</h3>
          <Form inline className="mb-3">
            <Form.Group controlId="filterEmail" className="mr-2">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Filter by email" 
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="filterDate" className="mr-2">
              <Form.Label>Date</Form.Label>
              <Form.Control 
                type="date" 
                placeholder="Filter by date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Email</th>
                <th>Referral Details</th>
                <th>Created By</th>
                <th>Doctor Email</th>
                <th>Created At</th>
                <th>Acknowledged</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map(referral => (
                <tr key={referral.id}>
                  <td>{referral.id}</td>
                  <td>{referral.patientemail}</td>
                  <td>{referral.referralDetails}</td>
                  <td>{referral.createdBy}</td>
                  <td>{referral.doctoremail}</td>
                  <td>{new Date(referral.createdAt).toLocaleString()}</td>
                  <td>{referral.acknowledged ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
      <AdminFooter />
    </div>
  );
};

export default Admin;
