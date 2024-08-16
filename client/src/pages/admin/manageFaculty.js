import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus,faFilter } from '@fortawesome/free-solid-svg-icons';
import {useNavigate,useLocation} from "react-router-dom";

import Papa from 'papaparse';

const ManageFaculty = () => {
  const location = useLocation();
  const [admin,setAdmin] = useState(null);
  const email = location.state?.email;
  const Navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [file, setFile] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);


  const handleProfileClick = () => {
    Navigate('/ProfilePage', { state: { user: 'admin', email: email } });
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



  const [newFaculty, setNewFaculty] = useState({
    F_ID: '',
    F_NAME: '',
    F_DEP: '',
    Email: '',
    F_NO: '',
    Password: ''
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filters, setFilters] = useState({
    F_NAME: '',
    F_ID: '',
    F_DEP: ''
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await fetch('http://localhost:5555/api/faculty');
      if (response.ok) {
        const data = await response.json();
        setFaculty(data);
        setFilteredFaculty(data);  
      } else {
        console.error('Failed to fetch faculty');
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddFaculty = async () => {
    if (!file) {
      alert('No file selected');
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const FacultyData = results.data.filter(faculty => faculty.F_ID);

        if (FacultyData.length === 0) {
          alert('Faculty file is empty');
          return;
        }

        for (let faculty of FacultyData) {
          try {
            const existingFaculty = await fetch(`http://localhost:5555/api/faculty/${faculty.F_ID}`);
            if (existingFaculty.ok) {
              const updatedFaculty = await fetch(`http://localhost:5555/api/faculty/${faculty.F_ID}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(faculty)
              });
              if (!updatedFaculty.ok) {
                throw new Error('Failed to update Faculty');
              }
            } else {
              const response = await fetch('http://localhost:5555/api/faculty', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(faculty)
              });
              if (!response.ok) {
                throw new Error('Failed to add Faculty');
              }
            }
          } catch (error) {
            alert(`Error adding Faculty: ${error.message}`);
          }
        }

        alert('Faculties added successfully!');
        fetchFaculty();
      }
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFaculty = [...faculty];
    updatedFaculty[index] = {
      ...updatedFaculty[index],
      [name]: value
    };
    setFaculty(updatedFaculty);
  };

  const handleSave = async (index) => {
    const facultyId = faculty[index].F_ID;

    try {
      const response = await fetch(`http://localhost:5555/api/faculty/${facultyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(faculty[index])
      });

      if (response.ok) {
        alert('Faculty updated successfully!');
        fetchFaculty();
        setEditingIndex(null);
      } else {
        console.error('Failed to update faculty:', faculty[index]);
        alert('Failed to update faculty');
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert(`Error updating faculty: ${error.message}`);
    }
  };

  const handleAssignCoursesToFaculty = async (faculty) => {
    Navigate('/manageClass/faculty/assign-courses/', { state: { F_ID:faculty.F_ID, F_NAME: faculty.F_NAME } });
  }
  
  const handleDelete = async (F_ID) => {
    try {
      const response = await fetch(`http://localhost:5555/api/faculty/${F_ID}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Faculty deleted successfully!');
        setFaculty(faculty.filter(faculty => faculty.F_ID !== F_ID));
        setFilteredFaculty(filteredFaculty.filter(faculty => faculty.F_ID !== F_ID));
      } else {
        alert('Failed to delete faculty');
      }
    } catch (error) {
      alert(`Error deleting faculty: ${error.message}`);
    }
  };

  const handleNewFacultyChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty({
      ...newFaculty,
      [name]: value
    });
  };

  const handleAddNewFaculty = async () => {
    if (!newFaculty.Email) {
      alert('Email is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/api/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFaculty)
      });

      if (response.ok) {
        alert('New faculty added successfully!');
        fetchFaculty();
        setNewFaculty({
          F_ID: '',
          F_NAME: '',
          F_DEP: '',
          Email: '',
          F_NO: '',
          Password: ''
        });
        setIsPopupVisible(false);
      } else {
        console.error('Failed to add new faculty');
        alert('Failed to add new faculty');
      }
    } catch (error) {
      console.error('Error adding new faculty:', error);
      alert(`Error adding new faculty: ${error.message}`);
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
    const { F_NAME, F_ID, F_DEP } = filters;
    const filtered = faculty.filter(faculty =>
      (F_NAME ? faculty.F_NAME.toLowerCase().includes(F_NAME.toLowerCase()) : true) &&
      (F_ID ? faculty.F_ID.toLowerCase().includes(F_ID.toLowerCase()) : true) &&
      (F_DEP ? faculty.F_DEP.toLowerCase().includes(F_DEP.toLowerCase()) : true)
    );
    setFilteredFaculty(filtered);
  }, [filters, faculty]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="manage-faculty">

<header>
        <div className="header-content">
          <div>
          <h2>Manage Faculty</h2>
        <p>You can add faculty by uploading a CSV file or by manually entering their details.</p>
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
          <button onClick={handleAddFaculty} className="submit-button">
            Upload data
          </button>
        </div>

        <h2>Faculty List</h2>
        
        <div className="filters" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <input
            type="text"
            name="F_NAME"
            value={filters.F_NAME}
            onChange={handleFilterChange}
            placeholder="Filter by Name"
            className="input"
            style={{ width: "25%" }}
          />
          <input
            type="text"
            name="F_ID"
            value={filters.F_ID}
            onChange={handleFilterChange}
            placeholder="Filter by Faculty ID"
            className="input"
            style={{ width: "25%" }}
          />
          <input
            type="text"
            name="F_DEP"
            value={filters.F_DEP}
            onChange={handleFilterChange}
            placeholder="Filter by Department"
            className="input"
            style={{ width: "25%" }}
          />
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>Faculty ID</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Name</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Department</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Phone Number</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Email</th>
                <th style={{ backgroundColor: "black", color: "white" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((faculty, index) => (
                <tr key={faculty.F_ID}>
                  <td>{faculty.F_ID}</td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="F_NAME"
                        value={faculty.F_NAME}
                        onChange={(e) => handleInputChange(e, index)}
                        className="input"
                      />
                    ) : (
                      faculty.F_NAME
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="F_DEP"
                        value={faculty.F_DEP}
                        onChange={(e) => handleInputChange(e, index)}
                        className="input"
                      />
                    ) : (
                      faculty.F_DEP
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        name="F_NO"
                        value={faculty.F_NO}
                        onChange={(e) => handleInputChange(e, index)}
                        className="input"
                      />
                    ) : (
                      faculty.F_NO
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="email"
                        name="Email"
                        value={faculty.Email}
                        onChange={(e) => handleInputChange(e, index)}
                        className="input"
                      />
                    ) : (
                      faculty.Email
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
                  <button onClick={() => handleDelete(faculty.F_ID)} className="delete-button">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button onClick={()=> handleAssignCoursesToFaculty(faculty)} >Assign Courses</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="button" onClick={handleOpenPopup} style={{borderRadius:"50%",height:"3rem",width:"3rem"}}>
        <FontAwesomeIcon icon={faPlus} />
        </button>
        {isPopupVisible && (
          <div className="popup">
            <h2>Add New Faculty</h2>
            <input
              type="text"
              name="F_ID"
              value={newFaculty.F_ID}
              onChange={handleNewFacultyChange}
              placeholder="Faculty ID"
              className="input"
            />
            <input
              type="text"
              name="F_NAME"
              value={newFaculty.F_NAME}
              onChange={handleNewFacultyChange}
              placeholder="Name"
              className="input"
            />
            <input
              type="text"
              name="F_DEP"
              value={newFaculty.F_DEP}
              onChange={handleNewFacultyChange}
              placeholder="Department"
              className="input"
            />
            <input
              type="text"
              name="F_NO"
              value={newFaculty.F_NO}
              onChange={handleNewFacultyChange}
              placeholder="Phone Number"
              className="input"
            />
            <input
              type="email"
              name="Email"
              value={newFaculty.Email}
              onChange={handleNewFacultyChange}
              placeholder="Email"
              className="input"
            />
            <input
              type="password"
              name="Password"
              value={newFaculty.Password}
              onChange={handleNewFacultyChange}
              placeholder="Password"
              className="input"
            />
            <button onClick={handleAddNewFaculty} className="button">
              Add Faculty
            </button>
            <button onClick={handleClosePopup} className="button">
              Cancel
            </button>
          </div>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ManageFaculty;
