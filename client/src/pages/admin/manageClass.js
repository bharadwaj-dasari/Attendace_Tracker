import React, { useState, useEffect, useCallback } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faTrash, faCheck, faTimes,faFilter } from '@fortawesome/free-solid-svg-icons';
import './manageClass.css';

const ManageClass = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const [admin,setAdmin] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classId, setNewClassId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [SECTION, setNewSECTION] = useState("");
  const [SEM, setNewSEM] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [updatedSEM, setUpdatedSEM] = useState("");
  const [updatedSECTION, setUpdatedSECTION] = useState("");
  const [filters, setFilters] = useState({ SEM: "", SECTION: "" });
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [OpenDropDownSEM, setOpenDropDownSEM] = useState(null);

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
    fetchClasses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, classes]);

  
    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

  const applyFilters = useCallback(() => {
    const filtered = classes.filter(cls => {
      const semMatch = filters.SEM? cls.SEM === parseInt(filters.SEM) : true;
      const sectionMatch = cls.SECTION.toLowerCase().includes(filters.SECTION.toLowerCase());
      return semMatch && sectionMatch;
    });
    setFilteredClasses(filtered);
  }, [filters, classes]);

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:5555/api/class");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleAddClass = async () => {
    if (SECTION === "" || SEM === "") {
      alert("Class name or Semester is empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:5555/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ SEM: SEM, SECTION: SECTION }),
      });

      if (response.ok) {
        console.log("Class added successfully");
        fetchClasses();
        setNewSECTION("");
        setNewSEM("");
      } else {
        console.error("Failed to add class, response status:", response.status);
        const errorData = await response.json();
        alert("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5555/api/class/${classId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchClasses();
      } else {
        console.error("Failed to delete class, response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleUpdateClass = async (classId) => {
    if (updatedSECTION === "" || !editingClass) return;
    try {
      const response = await fetch(`http://localhost:5555/api/class/${classId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ SECTION: updatedSECTION, SEM: updatedSEM }),
      });

      if (response.ok) {
        console.log("Class updated successfully");
        fetchClasses();
        setEditingClass(null);
        setUpdatedSECTION("");
        setUpdatedSEM("");
      } else {
        const errorData = await response.json();
        console.error("Failed to update class, response status:", response.status, errorData);
        alert(`Failed to update class: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Failed to update class. Please try again.");
    }
  };

  const handleAssignCoursesToClass = (cls) => {
    navigate(`admin/assign-courses`, { state: { classId: cls.classId, SEM: cls.SEM, SECTION: cls.SECTION, email: email } });
  };

  const handleAssignFacultyToClass = (cls) => {
    navigate(`admin/assign-faculty`, { state: { classId: cls.classId, SEM: cls.SEM, SECTION: cls.SECTION,email: email } });
  };

  const handleViewModal = (cls) => {
    navigate(`admin/view-class`, { state: { classId: cls.classId, SEM: cls.SEM, SECTION: cls.SECTION ,email: email} });
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="manage-class">
      <header>
        <div className="header-content">
          <div>
          <h2>Manage Classes</h2>
          <p>You can perform actions like add, delete, and update classes</p>
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
        <div className="form" style={{height:"4rem",display:"flex",alignItems:"center"}}>
          <input
            type="text"
            value={SEM}
            onChange={(e) => setNewSEM(e.target.value)}
            placeholder="Enter Semester"
            className="input"
          />
          <input
            type="text"
            value={SECTION}
            onChange={(e) => setNewSECTION(e.target.value)}
            placeholder="Enter Class Name"
            className="input"
          />
          <button onClick={handleAddClass} className="submit-button">Add Class</button>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems:"center",gap: "3rem",margin:"1rem",height:"3rem" }} className="filters">
      {showFilters && (
        <>
          <input
            type="text"
            name="SEM"
            value={filters.SEM}
            onChange={handleFilterChange}
            placeholder="Filter by SEM"
            style={{margin:"0.5rem"}}
          />
          <input
            type="text"
            name="SECTION"
            value={filters.SECTION}
            onChange={handleFilterChange}
            placeholder="Filter by SECTION"
            style={{margin:"0.5rem"}}
          />
        </>
      )}
      
      <button
        style={{
          right: "5rem",
          position: "absolute",
          height: "3rem",
          width: "3rem",
          borderRadius: "50%"
        }}
        onClick={toggleFilters}
      >
        <FontAwesomeIcon icon={faFilter} />
      </button>
    </div>
        <h2>Class List</h2>
        <table className="class-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Semester</th>
              <th>Class Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cls, index) => (
              <tr key={cls.classId}>
                <td>{index + 1}</td>
                <td>{editingClass === cls ? (
                  <input
                    type="text"
                    value={updatedSEM}
                    onChange={(e) => setUpdatedSEM(e.target.value)}
                    placeholder="Update Semester"
                    className="input"
                  />
                ) : (
                  cls.SEM
                )}</td>
                <td>{editingClass === cls ? (
                  <input
                    type="text"
                    value={updatedSECTION}
                    onChange={(e) => setUpdatedSECTION(e.target.value)}
                    placeholder="Update Class Name"
                    className="input"
                  />
                ) : (
                  cls.SECTION
                )}</td>
                <td style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: '0.5rem' }}  >
                  {editingClass === cls ? (
                    <>
                      <button onClick={()=>handleUpdateClass(cls.classId)} style={{ margin: "0.5rem 0rem" }}>
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button onClick={() => setEditingClass(null)} className="c-button" style={{ margin: "0.5rem 0rem" }}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => {
                      setEditingClass(cls);
                      setUpdatedSEM(cls.SEM);
                      setUpdatedSECTION(cls.SECTION);
                    }}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDeleteClass(cls.classId)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button onClick={() => handleViewModal(cls)} style={{ height: "35.58px" }}>View</button>
                  <div className="dropdown">
                    <button className="dropbtn" onClick={() => setOpenDropDownSEM(OpenDropDownSEM === cls.SEM ? null : cls.SEM)}>
                      <FontAwesomeIcon icon={faWrench} />
                    </button>
                    {OpenDropDownSEM === cls.SEM && (
                      <div className="dropdown-content">
                        <button onClick={() => handleAssignFacultyToClass(cls)}>Add Faculty</button>
                        <button onClick={() => handleAssignCoursesToClass(cls)}>Add Courses</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ManageClass;
