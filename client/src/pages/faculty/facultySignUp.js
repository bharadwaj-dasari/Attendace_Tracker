import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../signup.css';

function FacultySignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fID, setFID] = useState('');
  const [fName, setFName] = useState('');
  const [fDep, setFDep] = useState('');
  const [fNo, setFNo] = useState('');
  const [error, setError] = useState('');
  const role = 'faculty';
  

  const handleSignup = async (email, password, confirmPassword, role, fID, fName, fDep, fNo) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      const response = await fetch('http://localhost:5555/api/faculty',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          Role: role,
          F_ID: fID,
          F_NAME: fName,
          F_DEP: fDep,
          F_NO: fNo
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
    handleSignup(email, password, confirmPassword, role, fID, fName, fDep, fNo);
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
        <h2>Sign Up as Faculty</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fID">Faculty ID:</label>
          <input 
            type="text" 
            id="fID" 
            value={fID} 
            onChange={(e) => setFID(e.target.value)} 
            required 
          />
          <label htmlFor="fName">Name:</label>
          <input 
            type="text" 
            id="fName" 
            value={fName} 
            onChange={(e) => setFName(e.target.value)} 
            required 
          />
          <label htmlFor="fDep">Department:</label>
          <input 
            type="text" 
            id="fDep" 
            value={fDep} 
            onChange={(e) => setFDep(e.target.value)} 
            required 
          />
          <label htmlFor="fNo">Phone Number:</label>
          <input 
            type="text" 
            id="fNo" 
            value={fNo} 
            onChange={(e) => setFNo(e.target.value)} 
            required 
          />
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

export default FacultySignUp;
