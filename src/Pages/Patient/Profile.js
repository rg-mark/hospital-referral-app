import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Navbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker'; // Make sure to install react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import styles for DatePicker
import './patient-styles.css';
import axios from 'axios';

function LoginNav() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Brand href="#home">RMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Navbar>
  );
}

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: new Date(), // Initialize with current date
  });

  const [name,setname] = useState('');
  const [email,setemail] = useState('');
  const [phone,setphone] = useState('');
  const [address, setaddress] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let q_email = localStorage.getItem('email')
      try {
        const response = await axios.post('http://localhost:4000/patient/profile',{email: q_email}); 
        const data = response.data;
        console.log(data);  
        setaddress(response.data.Address);
        setemail(response.data.Email);
        setphone(response.data.phone);
        setname(response.data.Name);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          dob: new Date(data.dob), // Ensure dob is a Date object
        });
        setIsUpdating(true);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDob = formData.dob.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    try {
      const response = await fetch(`http://localhost:4000/patient/${isUpdating ? 'update-profile' : 'create-profile'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, dob: formattedDob }), // Send formatted date
      });
      const result = await response.json();
      console.log('Profile updated:', result);
      // Optionally redirect or show a success message
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleUpdate = async ()=>{
      
  }

  return (
    <>
      <LoginNav />
      <Container>
        <Card className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e)=> setname(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e)=> setemail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={address}
                    onChange={(e)=> setaddress(e.target.value)}
                    placeholder="Enter your address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" 
              onClick={()=> handleUpdate()}
            className="mt-3">
              {isUpdating ? 'Update Profile' : 'Create Profile'}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
