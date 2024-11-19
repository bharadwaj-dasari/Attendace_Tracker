import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import './manageStudent.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [admin,setAdmin] = useState(null);
  const [file, setFile] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedStudents, setUpdatedStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    S_ID: '',
    S_NAME: '',
    SECTION: '',
    SEM: '',
    S_PNO: '',
    Email: '',
    Password: ''
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filters, setFilters] = useState({
    studentName: '',
    studentId: '',
    semester: '',
    section: ''
  });
  const [filteredStudents, setFilteredStudents] = useState([]);

  const applyFilters = useCallback(() => {
    const filtered = students.filter(student => {
      const nameMatch = student.S_NAME.toLowerCase().includes(filters.studentName.toLowerCase());
      const idMatch = student.S_ID.toLowerCase().includes(filters.studentId.toLowerCase());
      const semMatch = filters.semester ? student.SEM === parseInt(filters.semester) : true;
      const sectionMatch = student.SECTION.toLowerCase().includes(filters.section.toLowerCase());
      return nameMatch && idMatch && semMatch && sectionMatch;
    });
    setFilteredStudents(filtered);
  }, [filters, students]);


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
    applyFilters();
  }, [applyFilters, filters, students]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5555/api/student');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddStudents = async () => {
    if (!file) {
      alert('No file selected');
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const studentsData = results.data.filter(student => student.S_ID);

        if (studentsData.length === 0) {
          alert('Student file is empty');
          return;
        }

        const errorMessages = [];

        for (let student of studentsData) {
          try {
            const response = await fetch('http://localhost:5555/api/student', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(student)
            });
            if (!response.ok) {
              throw new Error(`Failed to add student with ID ${student.S_ID}`);
            }
          } catch (error) {
            errorMessages.push(`Error adding student with ID ${student.S_ID}: ${error.message}`);
          }
        }

        if (errorMessages.length > 0) {
          alert(errorMessages.join('\n'));
        } else {
          alert('All students added successfully!');
          studentsData.length = 0;
          fetchStudents();
        }

        setFile(null); 
      },
      error: (error) => {
        alert(`Error parsing CSV file: ${error.message}`);
      }
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedStudentData = [...updatedStudents];
    updatedStudentData[index] = {
      ...updatedStudentData[index],
      [name]: value
    };
    setUpdatedStudents(updatedStudentData);
  };

  const handleSave = async (index) => {
    const studentId = students[index].S_ID;

    try {
      const response = await fetch(`http://localhost:5555/api/student/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedStudents[index])
      });

      if (response.ok) {
        alert('Student updated successfully!');
        fetchStudents();
        setEditingIndex(null);
      } else {
        console.error('Failed to update student:', updatedStudents[index]);
        alert('Failed to update student');
      }
    } catch (error) {
      alert(`Error updating student: ${error.message}`);
    }
  };

  const handleDelete = async (S_ID) => {
    try {
      const response = await fetch(`http://localhost:5555/api/student/${S_ID}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Student deleted successfully!');
        setStudents(students.filter(student => student.S_ID !== S_ID));
        setUpdatedStudents(updatedStudents.filter(student => student.S_ID !== S_ID));
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      alert(`Error deleting student: ${error.message}`);
    }
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  const handleAddNewStudent = async (S_ID) => {
    if (!newStudent.S_ID) {
      alert('S_ID is required');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5555/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
      });
  
      if (response.ok) {
        alert('New student added successfully!');
        fetchStudents();
        setNewStudent({
          S_ID: '',
          S_NAME: '',
          SECTION: '',
          SEM: '',
          S_PNO: '',
          Email: '',
          Password: ''
        });
        setIsPopupVisible(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to add new student: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      alert(`Error adding new student: ${error.message}`);
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

  return (
    <div className="manage-students">
      
        
        <header>
        <div className="header-content">
          <div>
            <h2>Manage Students</h2>
            <p>You can add students by uploading a CSV file or by manually entering their details.</p>
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

      <div className='body'>
        <div className="form">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="input-file"
          />
          <button onClick={handleAddStudents} className="submit-button">
            Upload data
          </button>
        </div>
       <div  style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
       <input
          type="text"
          name="studentName"
          value={filters.studentName}
          onChange={handleFilterChange}
          placeholder="Filter by Name"
        />
        <input
          type="text"
          name="studentId"
          value={filters.studentId}
          onChange={handleFilterChange}
          placeholder="Filter by ID"
        />
        <input
          type="text"
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          placeholder="Filter by Semester"
        />
        <input
          type="text"
          name="section"
          value={filters.section}
          onChange={handleFilterChange}
          placeholder="Filter by Section"
        />
       </div>
      <div className='table-container'>
        <table className='table'>
          <thead>
            <tr>
              <th style={{ backgroundColor: "black", color: "white" }}>ID</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Name</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Section</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Semester</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Phone Number</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Email</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Password</th>
              <th style={{ backgroundColor: "black", color: "white" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.S_ID}>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="S_ID"
                      value={updatedStudents[index].S_ID}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    student.S_ID
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="S_NAME"
                      value={updatedStudents[index].S_NAME}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    student.S_NAME
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="SECTION"
                      value={updatedStudents[index].SECTION}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    student.SECTION
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="SEM"
                      value={updatedStudents[index].SEM}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    student.SEM
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="S_PNO"
                      value={updatedStudents[index].S_PNO}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    student.S_PNO
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="email"
                      name="Email"
                      value={updatedStudents[index].Email}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    student.Email
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="password"
                      name="Password"
                      value={updatedStudents[index].Password}
                      onChange={(e) => handleInputChange(e, index)}
                      className="edit-input"
                    />
                  ) : (
                    '••••••••'
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
                  <button onClick={() => handleDelete(student.S_ID)} className="delete-button">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <button onClick={handleOpenPopup} className="add-button">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add New Student</h3>
            <input
              type="text"
              name="S_ID"
              value={newStudent.S_ID}
              onChange={handleNewStudentChange}
              placeholder="ROLL NUMBER"
            />
            <input
              type="text"
              name="S_NAME"
              value={newStudent.S_NAME}
              onChange={handleNewStudentChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="SECTION"
              value={newStudent.SECTION}
              onChange={handleNewStudentChange}
              placeholder="Section"
            />
            <input
              type="text"
              name="SEM"
              value={newStudent.SEM}
              onChange={handleNewStudentChange}
              placeholder="Semester"
            />
            <input
              type="text"
              name="S_PNO"
              value={newStudent.S_PNO}
              onChange={handleNewStudentChange}
              placeholder="Phone Number"
            />
            <input
              type="email"
              name="Email"
              value={newStudent.Email}
              onChange={handleNewStudentChange}
              placeholder="Email"
            />
            <input
              type="password"
              name="Password"
              value={newStudent.Password}
              onChange={handleNewStudentChange}
              placeholder="Password"
            />
            <button onClick={handleAddNewStudent} className="save-button">Add Student</button>
            <button onClick={handleClosePopup} className="close-button">Close</button>
          </div>
        </div>
      )}
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ManageStudents;
