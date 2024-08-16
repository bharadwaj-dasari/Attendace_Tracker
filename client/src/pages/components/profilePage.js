import React, { useState, useEffect } from 'react'; 
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const { user } = location.state || {};  
  const email = location.state?.email;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 

  const getUserDataByEmail = async (email, user) => {
    try {
      console.log(`Fetching user data for email: ${email}`);
      const response = await fetch(`http://localhost:5555/api/${user}/byEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('User data fetched:', data);
      setUserData(data);
      setLoading(false); 
    } catch (error) {
      console.error('Error in getUserDataByEmail:', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (email && typeof user === 'string') {
      getUserDataByEmail(email, user); 
    }
  }, [email, user]);

  if (!user) {
    return <div>No user data available</div>;
  }

  const renderProfileDetails = () => {
    if (loading) {
      return <div>Loading...</div>; 
    }

    switch (user) { 
      case 'student':
        return (
          <div className="student-info">
          
            
              <p><strong>Student ID:</strong> {userData.S_ID}</p>
              <p><strong>Name:</strong> {userData.S_NAME}</p>
              <p><strong>Section:</strong> {userData.SECTION}</p>
              <p><strong>Semester:</strong> {userData.SEM}</p>
              <p><strong>Phone Number:</strong> {userData.S_PNO}</p>
              <p><strong>Email:</strong> {userData.Email}</p>
            
         
        </div>
        );
      case 'faculty':
        return (
          <>
            <p><strong>Name:</strong> {userData.F_NAME}</p>
            <p><strong>Email:</strong> {userData.Email}</p>
            <p><strong>Faculty ID:</strong> {userData.F_ID}</p>
            <p><strong>Department:</strong> {userData.F_DEP}</p>
          </>
        );
      case 'admin':
        return (
          <>
            <p>Name: {userData?.A_NAME}</p>
            <p>Email: {userData?.Email}</p>
          </>
        );
      default:
        return <p>Unknown role</p>;
    }
  };

  return (
    <div className="profile">
      <header>
        <h2>{typeof user === 'string' ? user.charAt(0).toUpperCase() + user.slice(1) : 'Profile'} Profile</h2>
      </header>
      <div className="profile-details">
        {renderProfileDetails()}
      </div>
      <footer>
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
