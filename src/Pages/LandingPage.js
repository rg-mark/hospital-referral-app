import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-primary text-white text-center p-5">
        <h1>Welcome to RMS</h1>
        <p>Your solution for efficient referral management</p>
        <div className="mt-3">
          <Button variant="light" href="/login" className="mx-2">Login</Button>
          <Button variant="secondary" href="/register" className="mx-2">Register</Button>
        </div>
      </header>

      <Container className="flex-grow-1 mt-5">
        <Card className="p-4 shadow">
          <h2>About RMS</h2>
          <p>
            RMS (Referral Management System) streamlines the referral process for healthcare providers and patients. 
            Our user-friendly interface allows easy management of patient referrals, ensuring timely communication and improved patient care.
          </p>
        </Card>

        <h3 className="mt-5 text-center">How It Works</h3>
        <Row className="mt-4">
          <Col md={4}>
            <Card className="text-center mb-4 shadow">
              <Card.Body>
                <Card.Title>Seamless Referrals</Card.Title>
                <Card.Text>
                  Doctors can easily create and send referrals to specialists.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-4 shadow">
              <Card.Body>
                <Card.Title>Patient Tracking</Card.Title>
                <Card.Text>
                  Patients can track the status of their referrals in real-time.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-4 shadow">
              <Card.Body>
                <Card.Title>Secure Messaging</Card.Title>
                <Card.Text>
                  Direct communication between doctors and patients to clarify any concerns.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Card className="text-center mb-4 shadow">
              <Card.Body>
                <Card.Title>Data Analytics</Card.Title>
                <Card.Text>
                  Insights into referral trends and patient outcomes for healthcare providers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="text-center mb-4 shadow">
              <Card.Body>
                <Card.Title>Get Started Today!</Card.Title>
                <Button variant="primary" href="/register">Register</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <div>
          <p>&copy; 2024 RMS. All Rights Reserved.</p>
          <div>
            <a href="https://facebook.com" className="text-white mx-2"><FaFacebook /></a>
            <a href="https://twitter.com" className="text-white mx-2"><FaTwitter /></a>
            <a href="https://linkedin.com" className="text-white mx-2"><FaLinkedin /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
