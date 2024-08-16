import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../signup.css';

function AdminSignUp() {
  const navigate = useNavigate();
  const [aName, setAName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const role = 'admin';

  const handleSignup = async (aName, email, password, confirmPassword, role) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      const response = await fetch('http://localhost:5555/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({     
          A_NAME: aName,
          Email: email,
          Password: password,
          Role: role,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
      }

      const data = await response.json();

      if (data.token) {
        alert('Signup successful');
        navigate(`/${role}/${role}Dashboard`);
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
    handleSignup( aName, email, password, confirmPassword, role);
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
        <h2>Signup as Admin</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="aName">Admin Name:</label>
          <input 
            type="text" 
            id="aName" 
            value={aName} 
            onChange={(e) => setAName(e.target.value)} 
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

export default AdminSignUp;
