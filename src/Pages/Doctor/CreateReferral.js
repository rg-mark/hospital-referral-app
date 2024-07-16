import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';

const CreateReferral = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    referralReason: '',
    referredTo: '',
    notes: ''
  });

  const [email, setemail] = useState('');
  const [details, setDetails] = useState('');
  const [referredto, setreferredto] = useState('');
  const [to, setTo] = useState('');

  const [patients, setPatients] = useState([]);

  const getPatients = ()=>{
      axios.get('http://localhost:4000/admin/getusers')
        .then((resp)=>{
          setPatients(resp.data);
        }).catch((err)=>{
          console.error(err);
        })
  } 

  useEffect(()=>{
    getPatients();
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      
    });
  };

  const handleSubmit = (e) => {
    axios.post('http://localhost:4000/doctor/create-referral'
      ,{patientemail: email, referralDetails: details, createdBy: localStorage.getItem('email'), doctoremail:referredto }
    ).then(res=>{
      
    }).catch(err=>{
      console.error(err)
    })
    console.log('Referral created:', formData);
  };

  return (
    <Container>
      <h1>Create Referral</h1>
      <Card className="p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPatientName">
            <Form.Label>Patient Email</Form.Label>
            <Form.Control
              type="text"
              name="patientName"
              value={email}
              onChange={(e)=> setemail(e.target.value)}
              placeholder="Enter patient email"
            />
          </Form.Group>
          <Form.Group controlId="formReferralReason">
            <Form.Label>Referral Reason</Form.Label>
            <Form.Control
              type="text"
              name="referralReason"
              value={details}
              onChange={(e)=> setDetails(e.target.value)}
              placeholder="Enter referral reason"
            />
          </Form.Group>
          <Form.Group controlId="formReferredTo">
            <Form.Label>Referred To</Form.Label>
            <Form.Control
              type="text"
              name="referredTo"
              value={referredto}
              onChange={(e)=> setreferredto(e.target.value)}
              placeholder="Enter referred to"
            />
          </Form.Group>
          <Form.Group controlId="formNotes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any notes"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Create Referral
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateReferral;
