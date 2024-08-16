import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import './assignCourses.css';

const AssignCourses = () => {
  const location = useLocation();
  const { F_ID, F_NAME } = location.state;
  const [allCourses, setAllCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [isAssignCoursesPopupVisible, setIsAssignCoursesPopupVisible] = useState(false);
  const [isRemoveCoursesPopupVisible, setIsRemoveCoursesPopupVisible] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchFacultyCourses(F_ID);
  }, [F_ID]);

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
  

  const fetchFacultyCourses = async (F_ID) => {
    try {
      const response = await fetch(`http://localhost:5555/api/faculty/${F_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFacultyCourses(data.courseCode || []);
        setSelectedCourses(data.courseCode || []);
      } else {
        alert('Failed to fetch faculty courses');
      }
    } catch (error) {
      alert(`Error fetching faculty courses: ${error.message}`);
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
  

  const applyFilters = useCallback((term) => {
    const filtered = searchResults.filter(course => 
      course.courseCode.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchResults]);

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
      const newCourses = selectedCourses.filter(course => !facultyCourses.includes(course));
      for (let courseCode of newCourses) {
        const response = await fetch('http://localhost:5555/api/faculty/assignCourseToFaculty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ F_ID, courseCode })
        });
        if (!response.ok) {
          throw new Error(`Failed to assign course ${courseCode}`);
        }
      }
      alert('Courses assigned successfully');
      setIsAssignCoursesPopupVisible(false);
      fetchFacultyCourses(F_ID); 
    } catch (error) {
      alert(`Error assigning courses: ${error.message}`);
    }
  };

  const handleRemoveCourses = async () => {
    try {
      const removeCourses = selectedCourses.filter(course => facultyCourses.includes(course));
      for (let courseCode of removeCourses) {
        const response = await fetch('http://localhost:5555/api/faculty/removeCourseFromFaculty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ F_ID, courseCode })
        });
        if (!response.ok) {
          throw new Error(`Failed to remove course ${courseCode}`);
        }
      }
      alert('Courses removed successfully');
      setIsRemoveCoursesPopupVisible(false);
      fetchFacultyCourses(F_ID); 
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

  if (!F_ID) {
    return <div>No faculty selected</div>;
  }

  return (
    <div>
      <header>
        <h1>Assign & Remove Courses from Faculty.</h1>
        <p>Here you can assign&remove courses to your faculty: <span style={{color:"white",fontSize:"18px"}}>{F_NAME}</span></p>
      </header>
      <div >
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",margin:"7rem",justifyContent:"space-evenly"}}className="action-options">
      <button onClick={handleOpenAssignCoursesPopup}className="action-button">Assign Courses</button>
      <button onClick={handleOpenRemoveCoursesPopup}className="action-button">Remove Courses</button>
      </div>

      {isAssignCoursesPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Assign Courses to {F_NAME}</h2>
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
            <h2>Remove Courses from {F_NAME}</h2>
            <select multiple onChange={handleCourseSelection} className="course-select" value={selectedCourses}>
              {facultyCourses.map(course => (
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
