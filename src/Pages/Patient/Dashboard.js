import React from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Blood Pressure',
        data: [120, 125, 130, 128, 126, 122],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const appointments = [
    { date: '2024-07-20', doctor: 'Dr. Smith', type: 'Consultation' },
    { date: '2024-07-25', doctor: 'Dr. Johnson', type: 'Follow-up' },
  ];

  const activities = [
    '2024-07-10: Blood test results uploaded',
    '2024-07-08: Prescription refilled',
    '2024-07-05: Appointment with Dr. Lee completed'
  ];

  const cardInfo = [
    { title: 'Upcoming Appointments', value: appointments.length },
    { title: 'Recent Activities', value: activities.length },
  ];

  return (
    <Container>
      <h1>Dashboard</h1>
      <Row className="mb-4">
        {cardInfo.map((info, index) => (
          <Col key={index} md={6}>
            <Card>
              <Card.Body>
                <Card.Title>{info.title}</Card.Title>
                <Card.Text>{info.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Health Statistics</Card.Title>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Upcoming Appointments</Card.Title>
              <ul className="list-unstyled">
                {appointments.map((appointment, index) => (
                  <li key={index}>
                    <strong>{appointment.date}</strong>: {appointment.type} with {appointment.doctor}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Recent Activities</Card.Title>
              <ul className="list-unstyled">
                {activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Quick Links</Card.Title>
              <ul className="list-unstyled">
                <li><Button variant="link">View Medical Records</Button></li>
                <li><Button variant="link">Schedule Appointment</Button></li>
                <li><Button variant="link">Order Prescription</Button></li>
                <li><Button variant="link">Update Profile</Button></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
