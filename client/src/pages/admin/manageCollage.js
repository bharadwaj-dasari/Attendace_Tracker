import React ,{useState,useEffect}from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ManageCollage = () => {
    const location = useLocation();
    const navigate = useNavigate();
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

      useEffect(() => {
        if (email) {
          getAdminByEmail(email);
        }
      }, [email]);

    const handleManageClass = () => {
        navigate("/manageClass",{ state: { user: 'admin', email: email } });  
    };

    const handleManageFaculty = () => {
        navigate("/manageFaculty",{ state: { user: 'admin', email: email } });  
    };

    const handleManageCourses = () => {
        navigate("/manageCourses",{ state: { user: 'admin', email: email } });  
    };

    const handleManageStudent = () => {
        navigate("/manageStudent",{ state: { user: 'admin', email: email } });  
    };


    useEffect(() => {
        if (email) {
          getAdminByEmail(email);
        }
      }, [email]);
    
    return (
        <div className="manage-classes">
            <header>
        <div className="header-content" >
          <div>
            <h2>Manage Collage</h2>
            <p>Here you can manage classes,faculty,courses & students.</p>
          </div>
          <div className="profile-section" >
            <i className="fa-solid fa-user-circle profile-icon" onClick={handleProfileClick} style={{ fontSize: "2.2rem" }}></i>
            {admin && (
              <div className="profile-details">
                <p>{admin.A_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
            <div className="action-options">
                <div className="action-button class" onClick={handleManageClass}>
                    <i className="fa-solid fa-book"></i>Manage Class
                </div>
                <div className="action-button faculty" onClick={handleManageFaculty}>
                    <i className="fa-solid fa-person-chalkboard"></i>Manage Faculty
                </div>
                <div className="action-button courses" onClick={handleManageCourses}>
                    <i className="fa-solid fa-bookmark"></i>Manage Courses
                </div>
                <div className="action-button student" onClick={handleManageStudent}>
                    <i className="fa-solid fa-users-rectangle"></i>Manage Students
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default ManageCollage;
