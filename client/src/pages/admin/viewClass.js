import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import "./assignCourses.css"; 

const ViewClass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId } = location.state;
  const email = location.state?.email;
  const [admin,setAdmin] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupTitle, setPopupTitle] = useState("");

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

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/class/${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const classData = await response.json();

        setStudents(classData.S_ID);
        setFaculty(classData.F_ID);
        setCourses(classData.courseCode);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  const handleView = (type) => {
    let content;
    let title;
    switch (type) {
      case 'students':
        content = students;
        title = "Students";
        break;
      case 'faculty':
        content = faculty;
        title = "Faculty";
        break;
      case 'courses':
        content = courses;
        title = "Courses";
        break;
      default:
        content = null;
        title = "";
    }
    setPopupContent(content);
    setPopupTitle(title);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <header>
        <div className="header-content">
          <div>
          <h1>View Class</h1>
          <p>Here you can view students, faculty, and courses belonging to the class {classId}</p>
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
      <div className="action-options" style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <button onClick={() => handleView('students')} className="action-button">View Students</button>
        <button onClick={() => handleView('faculty')} className="action-button">View Faculty</button>
        <button onClick={() => handleView('courses')} className="action-button">View Courses</button>
      </div>
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{popupTitle}</h2>
            <ul>
              {popupContent.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button onClick={handleClosePopup} className="can-button">Close</button>
          </div>
        </div>
      )}
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewClass;
