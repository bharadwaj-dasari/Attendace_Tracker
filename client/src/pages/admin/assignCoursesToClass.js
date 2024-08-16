import React, { useState, useEffect, useCallback } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import './assignCourses.css';

const AssignCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId, SEM, SECTION } = location.state;
  const email = location.state?.email;
  const [admin,setAdmin] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [classCourses, setclassCourses] = useState([]);
  const [isAssignCoursesPopupVisible, setIsAssignCoursesPopupVisible] = useState(false);
  const [isRemoveCoursesPopupVisible, setIsRemoveCoursesPopupVisible] = useState(false);

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
    fetchCourses();
    fetchclassCourses(classId);
  }, [classId]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:5555/api/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllCourses(data);
        setSearchResults(data);
      } else {
        alert('Failed to fetch courses');
      }
    } catch (error) {
      alert(`Error fetching courses: ${error.message}`);
    }
  };

  const fetchclassCourses = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5555/api/class/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        setclassCourses(data.courseCode || []);
        setSelectedCourses(data.courseCode || []);
      } else {
        alert('Failed to fetch class courses');
      }
    } catch (error) {
      alert(`Error fetching class courses: ${error.message}`);
    }
  };

  const handleCourseSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setSearchResults(allCourses); 
    } else {
      const filteredCourses = allCourses.filter(course =>
        course.courseCode.toLowerCase().includes(term)
      );
      setSearchResults(filteredCourses);
    }
  };

  const handleCourseSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedCourses(selected);
  };

  const handleAssignCourses = async () => {
    try {
      const newCourses = selectedCourses.filter(course => !classCourses.includes(course));
      for (let courseCode of newCourses) {
        const response = await fetch('http://localhost:5555/api/courses/assignCourseToClass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId, courseCode })
        });
        if (!response.ok) {
          throw new Error(`Failed to assign course ${courseCode}`);
        }
      }
      alert('Courses assigned successfully');
      setIsAssignCoursesPopupVisible(false);
      fetchclassCourses(classId); 
    } catch (error) {
      alert(`Error assigning courses: ${error.message}`);
    }
  };

  const handleRemoveCourses = async () => {
    try {
      const removeCourses = selectedCourses.filter(course => classCourses.includes(course));
      for (let courseCode of removeCourses) {
        const response = await fetch('http://localhost:5555/api/courses/removeCourseFromClass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId, courseCode })
        });
        if (!response.ok) {
          throw new Error(`Failed to remove course ${courseCode}`);
        }
      }
      alert('Courses removed successfully');
      setIsRemoveCoursesPopupVisible(false);
      fetchclassCourses(classId); 
    } catch (error) {
      alert(`Error removing courses: ${error.message}`);
    }
  };

  const handleOpenAssignCoursesPopup = () => {
    setIsAssignCoursesPopupVisible(true);
  };

  const handleCloseAssignCoursesPopup = () => {
    setIsAssignCoursesPopupVisible(false);
  };

  const handleOpenRemoveCoursesPopup = () => {
    setIsRemoveCoursesPopupVisible(true);
  };

  const handleCloseRemoveCoursesPopup = () => {
    setIsRemoveCoursesPopupVisible(false);
  };

  if (!classId) {
    return <div>No class selected</div>;
  }

  return (
    <div>
      <header>
        <div className="header-content">
          <div>
            <h1>Assign & Remove Courses from class.</h1>
            <p>Here you can assign&remove courses to class: <span style={{color:"white",fontSize:"18px"}}>{classId}</span></p>
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
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "7rem", justifyContent: "space-evenly" }} className="action-options">
          <button onClick={handleOpenAssignCoursesPopup} className="action-button">Assign Courses</button>
          <button onClick={handleOpenRemoveCoursesPopup} className="action-button">Remove Courses</button>
        </div>

        {isAssignCoursesPopupVisible && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Assign Courses to {classId}</h2>
              <input 
                type="text" 
                placeholder="Search for courses" 
                value={searchTerm}
                onChange={handleCourseSearch} 
                className="course-search-input"
              />
              <select multiple onChange={handleCourseSelection} className="course-select" value={selectedCourses}>
                {searchResults.map(course => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode}
                  </option>
                ))}
              </select>
              <button onClick={handleAssignCourses} className="button">Assign</button>
              <button onClick={handleCloseAssignCoursesPopup} className="can-button">Cancel</button>
            </div>
          </div>
        )}

        {isRemoveCoursesPopupVisible && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Remove Courses from {classId}</h2>
              <select multiple onChange={handleCourseSelection} className="course-select" value={selectedCourses}>
                {classCourses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <button onClick={handleRemoveCourses} className="button">Remove</button>
              <button onClick={handleCloseRemoveCoursesPopup} className="can-button">Cancel</button>
            </div>
          </div>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AssignCourses;
