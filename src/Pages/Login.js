import React, {useState} from 'react';
import { Button, Form, Navbar, } from 'react-bootstrap';
import './page-styles.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Navbar.Brand href="#home">RMS</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Navbar>
    );
}

export default function Login() {
    const navigate = useNavigate();

    const [role,setRole] = useState('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');

    const HandleLogin = () =>{
        axios.post('http://localhost:4000/login',{email, password})
        .then((resp)=>{
            console.log(resp.data);
            let token = resp.data.token;
            let user = resp.data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("email",email);
            if(user.role == "patient") {
                navigate('/patient')
            }
            if(user.role == "doctor"){
                navigate('/doctor');
            }
            if(user.role == "admin"){
                
                navigate('/admin');
            }

        }).catch(err=>{
            console.error(err);
        });
    } 
    return (
        <>
            <LoginNav />
            <div className='main'>
                <>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={email} type="email" placeholder="Enter email" onChange={(e)=> setEmail(e.target.value)}/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label value={password} >Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                        <div className='row'>
                            <Button variant="primary" 
                                onClick={HandleLogin}
                            >
                                Login
                            </Button>
                            <p> Don't have an account ?<a href='/register'> register </a></p>
                        </div>
                    </Form>
                </>
            </div>

        </>
    )
}
