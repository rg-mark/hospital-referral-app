import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const DoctorProfileForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('specialty', specialty);
    if (photo) {
      formData.append('photo', photo);
    }

    // Submit the form data to the server (adjust the URL as necessary)
    try {
      const response = await fetch('/doctor/create-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      // Handle success (e.g., redirect or display a success message)
    } catch (error) {
      console.error('Error creating profile:', error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <Container>
      <h2>Create Doctor Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSpecialty">
          <Form.Label>Specialty</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPhoto">
          <Form.Label>Profile Photo</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Profile
        </Button>
      </Form>
    </Container>
  );
};

export default DoctorProfileForm;
