import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Navbar } from 'react-bootstrap';
import axios from 'axios';

function LoginNav() {
  const userEmail = localStorage.getItem('email');
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Brand href="#home">RMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Text className="ml-auto">
          Signed in as: <a href="#login">{userEmail}</a>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await axios.post('http://localhost:4000/patient/referrals', { email });
        setReferrals(response.data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <>
      <LoginNav />
      <Container>
        <h1>My Referrals</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Referral Details</th>
              <th>Created By</th>
              <th>Doctor Email</th>
              <th>Created At</th>
              <th>Acknowledged</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(referral => (
              <tr key={referral.id}>
                <td>{referral.id}</td>
                <td>{referral.referralDetails}</td>
                <td>{referral.createdBy}</td>
                <td>{referral.doctoremail}</td>
                <td>{new Date(referral.createdAt).toLocaleString()}</td>
                <td>{referral.acknowledged ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Referrals;
