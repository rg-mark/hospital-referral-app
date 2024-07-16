import React from 'react';
import { Table, Button, Container } from 'react-bootstrap';

const ViewAcknowledge = () => {
  const referrals = [
    { id: 1, patientName: 'John Doe', reason: 'Specialist Consultation', status: 'Pending' },
    { id: 2, patientName: 'Jane Smith', reason: 'Follow-up', status: 'Pending' }
  ];

  const acknowledgeReferral = (id) => {
    // Handle acknowledge logic here
    console.log('Acknowledged referral with id:', id);
  };

  return (
    <Container>
      <h1>View and Acknowledge Referral</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map(referral => (
            <tr key={referral.id}>
              <td>{referral.id}</td>
              <td>{referral.patientName}</td>
              <td>{referral.reason}</td>
              <td>{referral.status}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => acknowledgeReferral(referral.id)}
                >
                  Acknowledge
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewAcknowledge;
