import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa'; 

const CheckClassAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const userType = location.state?.user; 
  const [user, setUser] = useState(null);

  const handleProfileClick = () => {
    navigate('/ProfilePage', { state: { user: userType, email: email } });
  };

  const fetchUserByEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:5555/api/${userType}/byEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching ${userType}: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(`Error fetching ${userType}:`, error);
    }
  };

  useEffect(() => {
    if (email) fetchUserByEmail(email);
  }, [email]);

  const [formData, setFormData] = useState({
    classId: "",
    courseCode: "",
  });

  const [attendanceData, setAttendanceData] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await fetch(`http://localhost:5555/api/attendance/course/${formData.courseCode}/class/${formData.classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching attendance data: ${response.statusText}`);
      }

      const data = await response.json();

      const updatedAttendanceData = await Promise.all(
        data.map(async (record) => {
          const studentResponse = await fetch(`http://localhost:5555/api/student/${record.S_ID}`);
          const studentData = await studentResponse.json();
          const recentAttendance = record.attendance.slice(-5); 
          return {
            ...record,
            name: studentData.S_NAME,
            lastFewDays: recentAttendance.map(a => a.status),
            attendedClasses: record.attendance.filter(a => a.status === "Present").length,
            totalClasses: record.attendance.length,
            overallPercentage: `${(record.attendance.filter(a => a.status === "Present").length / record.attendance.length * 100).toFixed(2)}%`,
            remarks: record.attendance.length > 0 ? "Regular" : "Absent"
          };
        })
      );

      setAttendanceData(updatedAttendanceData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }

    setFormData({
      classId: "",
      courseCode: "",
    });
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <FaCheck style={{ color: 'green', fontSize: '1.5rem' }} />;
      case 'Absent':
        return <FaTimes style={{ color: 'red', fontSize: '1.5rem' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="check-class-attendance">
      <header>
        <div className="header-content">
          <div>
            <h2>Check Class Attendance</h2>
            <p>View the attendance records of a class.</p>
          </div>
          <div className="profile-section">
            <i
              className="fa-solid fa-user-circle profile-icon"
              onClick={handleProfileClick}
              style={{ fontSize: "2.2rem" }}
            ></i>
            {user && (
              <div className="profile-details">
                <p>{userType === 'faculty' ? user.F_NAME : user.A_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="body">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="courseCode">Course Code:</label>
            <input
              id="courseCode"
              name="courseCode"
              type="text"
              value={formData.courseCode}
              onChange={handleInputChange}
              placeholder="Enter Course Code"
            />
          </div>
          <div className="form-group">
            <label htmlFor="classId">Class ID:</label>
            <input
              id="classId"
              name="classId"
              type="text"
              value={formData.classId}
              onChange={handleInputChange}
              placeholder="Enter Class ID"
            />
          </div>
          <button type="submit">Show List</button>
        </form>

        <div className="attendance-box">
          <div className="attendance">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Last Few Days</th>
                  <th>Attended Classes</th>
                  <th>Total Classes</th>
                  <th>Overall Percentage</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.S_ID}</td>
                    <td>{record.name}</td>
                    <td>
                      {record.lastFewDays.map((status, idx) => (
                        <span key={idx} style={{ marginRight: '0.5rem' }}>
                          {renderStatusIcon(status)}
                        </span>
                      ))}
                    </td>
                    <td>{record.attendedClasses}</td>
                    <td>{record.totalClasses}</td>
                    <td>{record.overallPercentage}</td>
                    <td>{record.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CheckClassAttendance;
