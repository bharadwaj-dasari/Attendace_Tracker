import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './checkStudentAttendance.css';

const CheckStudentAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const userType = location.state?.user;  // Fetch user type from location state
  const [user, setUser] = useState(null); // Use user instead of faculty
  const [S_ID, setS_ID] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState("0%");

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

  const calculateAttendancePercentage = (attendance) => {
    const totalClasses = attendance.length;
    const attendedClasses = attendance.filter(record => record.status === 'Present').length;
    return totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) + '%' : '0%';
  };

  const fetchAttendanceData = async (S_ID) => {
    try {
      const response = await fetch(`http://localhost:5555/api/attendance/student/${S_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching attendance data: ${response.statusText}`);
      }

      const data = await response.json();

      const processedData = data.map(record => ({
        courseCode: record.courseCode,
        attendedClasses: record.attendance.filter(a => a.status === 'Present').length,
        totalClasses: record.attendance.length,
        attendancePercentage: calculateAttendancePercentage(record.attendance),
        status: record.attendance.length > 0 ? (record.attendance[0].status === 'Present' ? 'Safe' : 'Unsafe') : 'Unknown',
      }));

      setAttendanceData(processedData);

      const allAttendanceRecords = data.flatMap(record => record.attendance);
      const overallAttendedClasses = allAttendanceRecords.filter(a => a.status === 'Present').length;
      const overallTotalClasses = allAttendanceRecords.length;
      const overallPercentage = overallTotalClasses > 0 ? ((overallAttendedClasses / overallTotalClasses) * 100).toFixed(2) + '%' : '0%';
      setOverallAttendance(overallPercentage);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUserByEmail(email);
    }
  }, [email]);

  const handleFetchAttendance = () => {
    if (S_ID) {
      fetchAttendanceData(S_ID);
    } else {
      console.error("Roll number is required");
    }
  };

  return (
    <div className="check-student-attendance">
      <header>
        <div className="header-content">
          <div>
            <h2>Check Student Attendance</h2>
            <p>View the attendance records of students.</p>
          </div>
          <div className="profile-section">
            <i className="fa-solid fa-user-circle profile-icon" onClick={handleProfileClick} style={{ fontSize: "2.2rem" }}></i>
            {user && (
              <div className="profile-details">
                <p>{userType === 'faculty' ? user.F_NAME : user.A_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="body">
        <div className="roll"style={{display:'flex',flexDirection:'row',gap:'2rem',justifyContent:'center',alignItems:'center',marginBottom:'2rem'}}>
          <label>Enter Roll No:</label>
          <input
            type="tel"
            id="roll-input"
            placeholder="Enter Roll Number"
            value={S_ID}
            style={{maxWidth:'60%',margin:'0.5rem'}}
            onChange={(e) => setS_ID(e.target.value)}
          />
          <button className="view" onClick={handleFetchAttendance}>Show Attendance</button>
        </div>
        <div className="attendance-box">
          <h2>Current Semester Attendance</h2>
          <div className="attendance">
            <table>
              <thead>
                <tr>
                  <th>Course Id</th>
                  <th>Attended Classes</th>
                  <th>Total Classes</th>
                  <th>Attendance Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.courseCode}</td>
                    <td>{record.attendedClasses}</td>
                    <td>{record.totalClasses}</td>
                    <td>{record.attendancePercentage}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Overall Attendance: {overallAttendance}</h2>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CheckStudentAttendance;
