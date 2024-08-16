import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const CheckAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [admin, setAdmin] = useState(null);

  const handleProfileClick = () => {
    navigate('/ProfilePage', { state: { user: 'admin', email: email } });
  };

  const getAdminByEmail = async (email) => {
    try {
      console.log(`Fetching admin data for email: ${email}`);
      const response = await fetch(`http://localhost:5555/api/admin/byEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching admin: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Admin data fetched:', data);
      setAdmin(data);
      return data;
    } catch (error) {
      console.error('Error in getAdminByEmail:', error);
      return null;
    }
  };

  useEffect(() => {
    if (email) {
      getAdminByEmail(email);
    }
  }, [email]);

  const handleCheckClassAttendance = () => {
    console.log("Check Class Attendance clicked");
    navigate('/checkClassAttendance', { state: { user: 'admin', email: email } });
  };

  const handleCheckStudentAttendance = () => {
    console.log("Check Student Attendance clicked");
    navigate('/checkStudentAttendance', { state: { user: 'admin', email: email } });
  };

  return (
    <div className="check-attendance">
      <header>
        <div className="header-content">
          <div>
            <h2>Check Attendance</h2>
            <p>Choose between Class Attendance & Student Attendance</p>
          </div>
          <div className="profile-section">
            <i
              className="fa-solid fa-user-circle profile-icon"
              onClick={handleProfileClick}
              style={{ fontSize: "2.2rem" }}
            ></i>
            {admin && (
              <div className="profile-details">
                <p>{admin.A_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="action-options">
        <button className='action-button class-attendance' onClick={handleCheckClassAttendance}>
          <i className="fa-solid fa-users-between-lines"></i>
          <p className='p'>Check Class Attendance</p>
        </button>
        <button className='action-button student-attendance' onClick={handleCheckStudentAttendance}>
          <i className="fa-solid fa-user"></i>
          <p className='p'>Check Student Attendance</p>
        </button>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CheckAttendance;
