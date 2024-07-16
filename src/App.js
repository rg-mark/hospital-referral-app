import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Pages/Login';
import Register from './Pages/Register';
import LandingPage from './Pages/LandingPage';
import PatientHome from './Pages/Patient/PatientHome';
import DoctorHome from './Pages/Doctor/Home';
import DoctorProfile from './Pages/Doctor/Profile';
import UserProfile from './Pages/Patient/Profile'
import CreateReferral from './Pages/Doctor/CreateReferral';
import Admin from './Pages/Admin/Admin';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/patient' element={<PatientHome/>}/>
        <Route path='/doctor' element={<DoctorHome/>}/>
        <Route path='/doctor-profile' element={<DoctorProfile/>}/>
        <Route path='/patient-profile' element={<UserProfile/>}/> 
        <Route path='/create-referral' element={<CreateReferral/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/' element={<LandingPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
