import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Navbar, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function LoginNav() {
    const doctorEmail = localStorage.getItem('email');
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Navbar.Brand href="#home">RMS</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Navbar.Text className="ml-auto">
                    Signed in as: <a href="#login">{doctorEmail}</a>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}

const DoctorReferrals = () => {
    const [referrals, setReferrals] = useState([]);
    const doctorEmail = localStorage.getItem('email');

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const response = await axios.post('http://localhost:4000/doctor/get/referrals', { doctoremail: doctorEmail });
            console.log(response);
            setReferrals(response.data);
        } catch (error) {
            console.error('Error fetching referrals:', error);
        }
    };

    const handleAcknowledge = async (id, patientemail) => {
        try {
            await axios.post('http://localhost:4000/doctor/acknowledge-referral', { id, patientemail });
            fetchReferrals(); // Refresh the referrals after acknowledging
        } catch (error) {
            console.error('Error acknowledging referral:', error);
        }
    };

    return (
        <>
            <LoginNav />
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h1>Doctor's Referrals</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Patient Email</th>
                                    <th>Details</th>
                                    <th>Created By</th>
                                    <th>Created At</th>
                                    <th>Acknowledge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map((referral, index) => (
                                    <tr key={referral.id}>
                                        <td>{index + 1}</td>
                                        <td>{referral.patientemail}</td>
                                        <td>{referral.referralDetails}</td>
                                        <td>{referral.createdBy}</td>
                                        <td>{new Date(referral.createdAt).toLocaleString()}</td>
                                        <td>
                                            <Button
                                                variant="success"
                                                disabled={referral.acknowledged}
                                                onClick={() => handleAcknowledge(referral.id, referral.patientemail)}
                                            >
                                                {referral.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DoctorReferrals;
