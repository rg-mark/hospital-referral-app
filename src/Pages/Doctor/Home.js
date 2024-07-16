import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Container, Navbar, Button } from 'react-bootstrap';
import Profile from './Profile';
import './patient-styles.css';
import CreateReferral from './CreateReferral';
import Referrals from './Referrals';
import MyReferrals from './MyReferrals';

function LoginNav() {
  const [patientEmail, setPatientEmail] = useState('');

  useEffect(() => {
    // Get patient email from local storage
    const email = JSON.parse(localStorage.getItem("user")).email;
    console.log(email);
    if (email) {
      setPatientEmail(email);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      </Navbar.Collapse>
      <h2>
        RMS
      </h2>
      <Container>

      </Container>
      <Navbar.Text className="ml-auto">
          {patientEmail ? `Logged in as: ${patientEmail}` : 'Not logged in'}
        </Navbar.Text>
      <Button
        onClick={()=>{
          localStorage.clear();
          navigate('/login')
        }}
      >
        Log Out
      </Button>
    </Navbar>
  );
}

const PatientHomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'create-referral':
        return <CreateReferral/>
      case 'referrals':
        return <Referrals/> 
        case 'my-referrals':
          return <MyReferrals/> 
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
    <LoginNav/>
    <div className='main-page'>
      <div className='side-bar'>
        <ul className='nav'>
          <li
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </li>
          <li
            className={activeTab === 'create-referral' ? 'active' : ''}
            onClick={() => setActiveTab('create-referral')}
          >
            Create Referral
          </li>
          <li
            className={activeTab === 'referrals' ? 'active' : ''}
            onClick={() => setActiveTab('referrals')}
          >
            Referrals
          </li>
          <li
            className={activeTab === 'my-referrals' ? 'active' : ''}
            onClick={() => setActiveTab('my-referrals')}
          >
            Posted Referrals
          </li>
        </ul>
      </div>
      <div className='main-content'>
        {renderContent()}
      </div>
    </div>
    </>
  );
};

export default PatientHomePage;
