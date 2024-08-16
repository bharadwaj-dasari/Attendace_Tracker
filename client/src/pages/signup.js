/*import React, { useState } from 'react';
import './signup.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { Role: initialRole } = location.state || { Role: 'faculty' };

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [Role, setRole] = useState(initialRole);

  const handleSignup = async (Email, Password, confirmPassword, Role) => {
    if (Password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5100/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: Email,
          Password: Password,
          Role: Role,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
      }

      const data = await response.json();

      if (data.token) {
        alert('Signup successful');
        navigate(`/${Role}/${Role}Dashboard`);
      } else {
        throw new Error('Token not received in response');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Signup failed: ' + error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignup(Email, Password, confirmPassword, Role);
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

  return (
    <div className='signup-page'>
      <div className="container">
        <h2>Signup as {Role}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={Email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            className='pass'
            id="password" 
            value={Password} 
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
          
          <button type="submit">Signup</button>
        </form>
        {Role && (
          <p>
            Already have an account? <Link to={{ pathname: "/login", state: { Role } }}>Login as {Role}</Link>
          </p>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;*/
