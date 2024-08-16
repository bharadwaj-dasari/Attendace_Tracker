import React, { useState, useEffect, useCallback } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import './assignCourses';

const AssignFaculty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [admin,setAdmin] = useState(null);
  const { classId,SEM,SECTION } = location.state;
  const [allFaculty, setAllFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [classFaculty, setclassFaculty] = useState([]);
  const [isAssignFacultyPopupVisible, setIsAssignFacultyPopupVisible] = useState(false);
  const [isRemoveFacultyPopupVisible, setIsRemoveFacultyPopupVisible] = useState(false);

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

  const handleProfileClick = () => {
    navigate('/ProfilePage', { state: { user: 'admin', email: email } });
  };

  useEffect(() => {
    fetchFaculty();
    fetchclassFaculty(classId);
  }, [classId]);

  const fetchFaculty = async () => {
    try {
      const response = await fetch(`http://localhost:5555/api/faculty`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllFaculty(data);
        setSearchResults(data);
      } else {
        alert('Failed to fetch Faculty');
      }
    } catch (error) {
      alert(`Error fetching Faculty: ${error.message}`);
    }
  };
  

  const fetchclassFaculty = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5555/api/class/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        setclassFaculty(data.F_ID || []);
        setSelectedFaculty(data.F_ID || []);
      } else {
        alert('Failed to fetch class Faculty');
      }
    } catch (error) {
      alert(`Error fetching class Faculty: ${error.message}`);
    }
  };

  const handleFacultyearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    if (term === "") {
      setSearchResults(allFaculty);
    } else {
      const filteredFaculty = allFaculty.filter(Faculty =>
        Faculty.F_ID.toLowerCase().includes(term)
      );
      setSearchResults(filteredFaculty);
    }
  };
  

  const applyFilters = useCallback((term) => {
    const filtered = searchResults.filter(Faculty => 
      Faculty.F_ID.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchResults]);

  const handleFacultyelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedFaculty(selected);
  };

  const handleAssignFaculty = async () => {
    try {
      const newFaculty = selectedFaculty.filter(Faculty => !classFaculty.includes(Faculty));
      for (let F_ID of newFaculty) {
        const response = await fetch('http://localhost:5555/api/faculty/assignFacultyToClass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId, F_ID })
        });
        if (!response.ok) {
          throw new Error(`Failed to assign Faculty ${F_ID}`);
        }
      }
      alert('Faculty assigned successfully');
      setIsAssignFacultyPopupVisible(false);
      fetchclassFaculty(classId); 
    } catch (error) {
      alert(`Error assigning Faculty: ${error.message}`);
    }
  };

  const handleRemoveFaculty = async () => {
    try {
      const removeFaculty = selectedFaculty.filter(Faculty => classFaculty.includes(Faculty));
      for (let F_ID of removeFaculty) {
        const response = await fetch('http://localhost:5555/api/faculty/removeFacultyFromClass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId, F_ID })
        });
        if (!response.ok) {
          throw new Error(`Failed to remove Faculty ${F_ID}`);
        }
      }
      alert('Faculty removed successfully');
      setIsRemoveFacultyPopupVisible(false);
      fetchclassFaculty(classId); 
    } catch (error) {
      alert(`Error removing Faculty: ${error.message}`);
    }
  };

  const handleOpenAssignFacultyPopup = () => {
    setIsAssignFacultyPopupVisible(true);
  };

  const handleCloseAssignFacultyPopup = () => {
    setIsAssignFacultyPopupVisible(false);
  };

  const handleOpenRemoveFacultyPopup = () => {
    setIsRemoveFacultyPopupVisible(true);
  };

  const handleCloseRemoveFacultyPopup = () => {
    setIsRemoveFacultyPopupVisible(false);
  };

  if (!classId) {
    return <div>No class selected</div>;
  }

  return (
    <div>
      <header>
        <div className="header-content" >
          <div>
          <h1>Assign & Remove Faculty from class.</h1>
          <p>Here you can assign&remove Faculty to class: <span style={{color:"white",fontSize:"18px"}}>{SEM}-{SECTION}</span></p>
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
      <div >
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",margin:"7rem",justifyContent:"space-evenly"}}className="action-options">
      <button onClick={handleOpenAssignFacultyPopup}className="action-button">Assign Faculty</button>
      <button onClick={handleOpenRemoveFacultyPopup}className="action-button">Remove Faculty</button>
      </div>

      {isAssignFacultyPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Assign Faculty to {classId}</h2>
            <input 
              type="text" 
              placeholder="Search for Faculty" 
              value={searchTerm}
              onChange={handleFacultyearch} 
              className="course-search-input"
            />
            <select multiple onChange={handleFacultyelection} className="course-select" value={selectedFaculty}>
              {searchResults.map(Faculty => (
                <option key={Faculty.F_ID} value={Faculty.F_ID}>
                  {Faculty.F_ID}
                </option>
              ))}
            </select>
            <button onClick={handleAssignFaculty} className="button">Assign</button>
            <button onClick={handleCloseAssignFacultyPopup} className="can-button">Cancel</button>
          </div>
        </div>
      )}

      {isRemoveFacultyPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Remove Faculty from {classId}</h2>
            <select multiple onChange={handleFacultyelection} className="course-select" value={selectedFaculty}>
              {classFaculty.map(Faculty => (
                <option key={Faculty} value={Faculty}>
                  {Faculty}
                </option>
              ))}
            </select>
            <button onClick={handleRemoveFaculty} className="button">Remove</button>
            <button onClick={handleCloseRemoveFacultyPopup} className="can-button">Cancel</button>
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

export default AssignFaculty;
