import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './facultyDashboard.css';

const FacultyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [faculty, setFaculty] = useState(null);

  const handleProfileClick = () => {
    navigate('/ProfilePage', { state: { user: 'faculty', email: email } });
  };

  const getFacultyByEmail = async (email) => {
    try {
      console.log(`Fetching faculty data for email: ${email}`);
      const response = await fetch(`http://localhost:5555/api/faculty/byEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching faculty: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Faculty data fetched:', data);
      setFaculty(data);
      return data;
    } catch (error) {
      console.error('Error in getFacultyByEmail:', error);
      return null;
    }
  };

  useEffect(() => {
    if (email) {
      getFacultyByEmail(email);
    }
  }, [email]);

  return (
    <div className='faculty-dashboard'>
      <header>
        <div className="header-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>
            <h2>Faculty Dashboard</h2>
            <p>Welcome to the faculty dashboard! Check your attendance</p>
          </div>
          <div className="profile-section" style={{ position: "absolute", right: "4rem"}}>
            <i className="fa-solid fa-user-circle profile-icon" onClick={handleProfileClick} style={{ fontSize: "2.2rem" }}></i>
            {faculty && (
              <div className="profile-details">
                <p>{faculty.F_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='action-options'>
        <button className='action-button mark' onClick={() => navigate('/faculty/markAttendance',{state: { user: 'faculty', email: email }})}>
          <i className="fa-solid fa-clipboard-user"></i>
          <p className='p'>Mark Attendance</p>
        </button>
        <button className='action-button class-attendance' onClick={() => navigate('/checkClassAttendance',{state: { user: 'faculty', email: email }})}>
          <i className="fa-solid fa-users-between-lines"></i>
          <p className='p'>Check Class Attendance</p>
        </button>
        <button className='action-button student-attendance' onClick={() => navigate('/checkStudentAttendance',{state: { user: 'faculty', email: email }})}>
          <i className="fa-solid fa-user"></i>
          <p className='p'>Check Student Attendance</p>
        </button>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FacultyDashboard;
