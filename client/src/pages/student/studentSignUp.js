import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../signup.css';

function StudentSignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sID, setSID] = useState('');
  const [sName, setSName] = useState('');
  const [section, setSection] = useState('');
  const [sSem, setSSem] = useState('');
  const [sPno, setSPno] = useState('');
  const [error, setError] = useState('');
  const role = 'student';

  const handleSignup = async (email, password, confirmPassword, role, sID, sName, section, sSem, sPno) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      const response = await fetch('http://localhost:5555/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          Role: role,
          S_ID: sID,
          S_NAME: sName,
          SECTION: section,
          S_SEM: sSem, 
          S_PNO: sPno
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
      }

      const data = await response.json();

      if (data.token) {
        alert('Signup successful');
        navigate(`/${role}/${role}Dashboard`, { 
          state: { 
            user: data.user, 
            email: email,
            password: password,
          } 
        });
      } else {
        throw new Error('Token not received in response');
      }
    } catch (error) {
      setError('Signup failed: ' + error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    handleSignup(email, password, confirmPassword, role, sID, sName, section, sSem, sPno);
  };

  const showPassword = () => {
    const passwordFields = document.querySelectorAll('.pass');
    passwordFields.forEach((field) => {
      if (field.type === 'password') {
        field.type = 'text';
      } else {
        field.type = 'password';
      }
    });
  };

  const handleLoginLink = () => {
    navigate(-1);
  };

  return (
    <div className='signup-page'>
      <div className="container">
        <h2>Signup as Student</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            className='pass'
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            className='pass'
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <label htmlFor="sID">Roll No:</label>
          <input 
            type="text" 
            id="sID" 
            value={sID} 
            onChange={(e) => setSID(e.target.value)} 
            required 
          />
          <label htmlFor="sName">Name :</label>
          <input 
            type="text" 
            id="sName" 
            value={sName} 
            onChange={(e) => setSName(e.target.value)} 
            required 
          />
          <label htmlFor="section">Section:</label>
          <input 
            type="text" 
            id="section" 
            value={section} 
            onChange={(e) => setSection(e.target.value)} 
            required 
          />
          <label htmlFor="sSem">Semester:</label>
          <input 
            type="tel" 
            min={1}
            max={8}
            id="sSem" 
            value={sSem} 
            onChange={(e) => setSSem(e.target.value)} 
            required 
          />
          <label htmlFor="sPno">Phone No :</label>
          <input 
            type="text" 
            id="sPno" 
            value={sPno} 
            onChange={(e) => setSPno(e.target.value)} 
            required 
          />
          <div className='sP'>
            <input type="checkbox" onChange={showPassword} />
            <label>Show Password</label>
          </div>

          {error && <p className="error">{error}</p>}
          
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <button onClick={handleLoginLink} className="back">Login as {role}</button>
        </p>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default StudentSignUp;
