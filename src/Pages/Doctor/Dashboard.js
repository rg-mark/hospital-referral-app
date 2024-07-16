import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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

const DoctorDashboard = () => {
    const [lineData, setLineData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Patient Referrals',
                data: new Array(12).fill(0),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    });

    const [cardInfo, setCardInfo] = useState([
        { title: 'Total Referrals', value: '0' },
        { title: 'Pending Referrals', value: '0' },
        { title: 'Acknowledged Referrals', value: '0' },
    ]);

    const doctorEmail = localStorage.getItem('email');

    useEffect(() => {
        fetchReferralData();
        fetchReferralCounts();
    }, []);

    const fetchReferralData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/doctor/referral-stats', {
                params: { doctoremail: doctorEmail },
            });
            setLineData((prevData) => ({
                ...prevData,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: response.data,
                    },
                ],
            }));
        } catch (error) {
            console.error('Error fetching referral data:', error);
        }
    };

    const fetchReferralCounts = async () => {
        try {
            const response = await axios.post('http://localhost:4000/doctor/referral-counts', { doctoremail: doctorEmail });
            setCardInfo([
                { title: 'Total Referrals', value: response.data.totalReferrals },
                { title: 'Pending Referrals', value: response.data.pendingReferrals },
                { title: 'Acknowledged Referrals', value: response.data.acknowledgedReferrals },
            ]);
        } catch (error) {
            console.error('Error fetching referral counts:', error);
        }
    };

    return (
        <>
            <LoginNav />
            <Container>
                <h1>Doctor Dashboard</h1>
                <Row className="mb-4">
                    {cardInfo.map((info, index) => (
                        <Col key={index} md={4}>
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
                                <Card.Title>Referral Trends</Card.Title>
                                <Line data={lineData} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Quick Links</Card.Title>
                                <ul className="list-unstyled">
                                    <li><Link to="/create-referral"><Button variant="link">Create Referral</Button></Link></li>
                                    <li><Link to="/view-acknowledge-referral"><Button variant="link">View and Acknowledge Referral</Button></Link></li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DoctorDashboard;
