import React from 'react';
import { useNavigate } from 'react-router-dom';
import './userSelection.css';

const UserSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    
    navigate('/login', { state: { Role: role } });
    
  };

  return (
    <div className="user-selection">
      <header>
      <h2>Select Your Role</h2>
      </header>
      <div className="role-options">
        <button className="role-button student" onClick={() => handleRoleSelection('student')}>
          <i className="fa-solid fa-user"></i>Student
        </button>
        <button className="role-button faculty" onClick={() => handleRoleSelection('faculty')}>
          <i className="fa-solid fa-chalkboard-user"></i>Faculty
        </button>
        <button className="role-button admin" onClick={() => handleRoleSelection('admin')}>
          <i className="fa-solid fa-building-columns"></i>Admin
        </button>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserSelection;
