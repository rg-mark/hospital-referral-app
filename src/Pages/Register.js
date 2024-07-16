import React, { useState } from 'react';
import { Button, Form, Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import './page-styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Navbar.Brand href="#home">Register</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Navbar>
    );
}

export default function Register() {

    const navigate = useNavigate();

    const [role,setRole] = useState('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');

    const HandleRegister = () => {    
        axios.post('http://localhost:4000/register', { username, email, password, role })
            .then((resp) => {
                console.log(resp);
                if (role === 'patient') {
                    return axios.post('http://localhost:4000/patient/create-profile', {
                        email,
                        name: username,
                        address: 'Nairobi',
                        dob:new Date().toISOString().split('T')[0]
                    });
                } else {
                    return axios.post('http://localhost:4000/doctor/create-profile', {
                        email,
                        name: username,
                        specialty: 'Nairobi',
                        photo: ''
                    });
                }
            })
            .then(() => {
                navigate('/login');
            })
            .catch(err => {
                console.error(err);
            });
    };
        
    return (
        <>
            <LoginNav />
            <div className='main'>
                <>
                    <Form>
                        <Form.Group>
                            <Form.Select aria-label="Default select example"
                                onChange={(e)=> setRole(e.target.value)}
                            >
                                <option value="doctor">Doctor</option>
                                <option value="patient">Patient</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" 
                                onChange={(e)=> setEmail(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                User Name
                            </Form.Label>
                            <Form.Control placeholder='User name' onChange={(e)=> setUserName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" 
                                onChange={(e)=> setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className='row'>
                            <Button variant="primary" onClick={HandleRegister}>
                                Register
                            </Button>
                            <p> Have an account ?<a href='/login'> login </a></p>
                        </div>
                    </Form>
                </>
            </div>
        </>
    )
}
