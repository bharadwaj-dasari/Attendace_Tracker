import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import Papa from 'papaparse';

const ManageCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [admin,setAdmin] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    courseCode: '',
    courseTitle: '',
    courseType: ''
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filters, setFilters] = useState({
    courseTitle: '',
    courseCode: '',
    courseType: ''
  });


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
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5555/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };


  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddCourses = async () => {
  if (!file) {
    alert('No file selected');
    return;
  }

  Papa.parse(file, {
    header: true,
    complete: async (results) => {
      const coursesData = results.data.filter(course => course.courseCode);

      if (coursesData.length === 0) {
        alert('Course file is empty');
        return;
      }

      for (let course of coursesData) {
        try {
          const existingCourse = await fetch(`http://localhost:5555/api/courses/${course.courseCode}`);
          if (existingCourse.ok) {
            const updatedCourse = await fetch(`http://localhost:5555/api/courses/${course.courseCode}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(course)
            });
            if (!updatedCourse.ok) {
              throw new Error('Failed to update course');
            }
          } else {
            const response = await fetch('http://localhost:5555/api/courses', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(course)
            });
            if (!response.ok) {
              throw new Error('Failed to add course');
            }
          }
        } catch (error) {
          alert(`Error adding course: ${error.message}`);
        }
      }

      alert('Courses added successfully!');
      fetchCourses();
    }
  });
};


  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCourses = [...courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [name]: value
    };
    setCourses(updatedCourses);
  };

  const handleSave = async (index) => {
    const courseCode = courses[index].courseCode;

    try {
      const response = await fetch(`http://localhost:5555/api/courses/${courseCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courses[index])
      });

      if (response.ok) {
        alert('Course updated successfully!');
        fetchCourses();
        setEditingIndex(null);
      } else {
        console.error('Failed to update course:', courses[index]);
        alert('Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert(`Error updating course: ${error.message}`);
    }
  };

  const handleDelete = async (index) => {
    const courseCode = courses[index].courseCode;

    try {
      const response = await fetch(`http://localhost:5555/api/courses/${courseCode}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Course deleted successfully!');
        setCourses(courses.filter(course => course.courseCode !== courseCode));
        setFilteredCourses(filteredCourses.filter(course => course.courseCode !== courseCode));
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      alert(`Error deleting course: ${error.message}`);
    }
  };

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value
    });
  };

  const handleAddNewCourse = async () => {
    if (!newCourse.courseCode) {
      alert('Course code is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      });

      if (response.ok) {
        alert('New course added successfully!');
        fetchCourses();
        setNewCourse({
          courseCode: '',
          courseTitle: '',
          courseType: ''
        });
        setIsPopupVisible(false);
      } else {
        console.error('Failed to add new course');
        alert('Failed to add new course');
      }
    } catch (error) {
      console.error('Error adding new course:', error);
      alert(`Error adding new course: ${error.message}`);
    }
  };

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = useCallback(() => {
    const { courseTitle, courseCode, courseType } = filters;
    const filtered = courses.filter(course =>
      (courseTitle ? course.courseTitle.toLowerCase().includes(courseTitle.toLowerCase()) : true) &&
      (courseCode ? course.courseCode.toLowerCase().includes(courseCode.toLowerCase()) : true) &&
      (courseType ? course.courseType.toLowerCase().includes(courseType.toLowerCase()) : true)
    );
    setFilteredCourses(filtered);
  }, [filters, courses]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="manage-course">

      <header>
        <div className="header-content">
          <div>
          <h2>Manage Courses</h2>
        <p>You can add courses by uploading a CSV file or by manually entering their details.</p>
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
      <div className="body">
        <div className="form">

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="input-file"
          />
         
          <button onClick={handleAddCourses} className="submit-button">
            Upload data
          </button>
        </div>

        
        <h2>Course List</h2>
        <div className="filters" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <input
            type="text"
            name="courseTitle"
            value={filters.courseTitle}
            onChange={handleFilterChange}
            placeholder="Filter by Title"
            className="input"
            style={{ width: "25%" }}
          />
          <input
            type="text"
            name="courseCode"
            value={filters.courseCode}
            onChange={handleFilterChange}
            placeholder="Filter by Code"
            className="input"
            style={{ width: "25%" }}
          />
          <input
            type="text"
            name="courseType"
            value={filters.courseType}
            onChange={handleFilterChange}
            placeholder="Filter by Type"
            className="input"
            style={{ width: "25%" }}
          />
        </div>

       
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>Course Code</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Title</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Type</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={course.courseCode} >
                  <td >
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="courseCode"
                        value={course.courseCode}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      course.courseCode
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="courseTitle"
                        value={course.courseTitle}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      course.courseTitle
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="courseType"
                        value={course.courseType}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      course.courseType
                    )}
                  </td>
                  <td style={{ display: 'flex', flexDirection: 'row',alignItems:'center', gap: '0.5rem' }}>
                    {editingIndex === index ? (
                      <>
                        <button onClick={() => handleSave(index)} className="s-button">
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button onClick={() => setEditingIndex(null)} className="c-button" style={{marginTop:"0.5rem",marginBottom:"0.5rem"}}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleEdit(index)} className="edit-button">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(index)} className="delete-button">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      
        <button onClick={handleOpenPopup}>Add New Course</button>

        
        {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <h3>Add New Course</h3>
              <form>
                <input
                  type="text"
                  name="courseCode"
                  value={newCourse.courseCode}
                  onChange={handleNewCourseChange}
                  placeholder="Course Code"
                  className="input"
                />
                <input
                  type="text"
                  name="courseTitle"
                  value={newCourse.courseTitle}
                  onChange={handleNewCourseChange}
                  placeholder="Title"
                  className="input"
                />
                <input
                  type="text"
                  name="courseType"
                  value={newCourse.courseType}
                  onChange={handleNewCourseChange}
                  placeholder="Type"
                  className="input"
                />
              </form>
              <button onClick={handleAddNewCourse} className="submit-button">
                Add Course
              </button>
              <button onClick={handleClosePopup} className="submit-button">
                Close
              </button>
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

export default ManageCourse;
