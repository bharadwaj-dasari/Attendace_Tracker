import React, { useState } from 'react';
import './login.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const defaultRole = 'student';
  const { Role = defaultRole } = location.state || {};

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5555/api/${Role}/login`, {
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
        alert('Login successful');
        login(data.token, Role);
        navigate(`/${Role}/${Role}Dashboard`, { 
          state: { 
            user: data.user, 
            email: Email,
            password: Password,
          } 
        });
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className='login-page'>
      <div className="container">
        <h2>Login as {Role}</h2>
        <form onSubmit={handleLogin}>
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
            type={showPassword ? 'text' : 'password'} 
            id="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className='sP'>
            <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
            <label>Show Password</label>
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to={{ pathname: `${Role}/${Role}Signup`}}>Sign Up as {Role}</Link>
        </p>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
