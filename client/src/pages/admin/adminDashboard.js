import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user; 
  const email = location.state?.email;
  const [admin,setAdmin] = useState(null);

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

  const handleManageClasses = () => {
    navigate('/admin/manageCollage',{ state: { user: 'admin', email: email } });
  };

  const handleCheckAttendance = () => {
    navigate('/admin/checkAttendance',{ state: { user: 'admin', email: email } });
  };


  useEffect(() => {
    if (email) {
      getAdminByEmail(email);
    }
  }, [email]);

  return (
    <div>
      <header>
        <div className="header-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome to the admin dashboard!</p>
          </div>
          <div className="profile-section" style={{ position: "absolute", right: "4rem" }}>
            <i className="fa-solid fa-user-circle profile-icon" onClick={handleProfileClick} style={{ fontSize: "2.2rem" }}></i>
            {admin && (
              <div className="profile-details">
                <p>{admin.A_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className='action-options'>
        <button className='action-button manage' onClick={handleManageClasses}>
          <i className="fa-solid fa-users-rectangle"></i>
          <p className='p'>Manage Collage</p>
        </button>
        <button className='action-button check' onClick={handleCheckAttendance}>
          <i className="fa-solid fa-users-between-lines"></i>
          <p className='p'>Check Attendance</p>
        </button>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;