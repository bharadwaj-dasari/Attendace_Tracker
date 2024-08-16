import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './studentDashboard.css';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [attendanceData, setAttendanceData] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [student, setStudent] = useState(null);

  const handleProfileClick = () => {
    navigate('/ProfilePage', { state: { user: 'student', email: email } });
  };

  const getStudentByEmail = async (email) => {
    try {
      console.log(`Fetching student data for email: ${email}`);
      const response = await fetch(`http://localhost:5555/api/student/byEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching student: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Student data fetched:', data);
      setStudent(data);
      return data;
    } catch (error) {
      console.error('Error in getStudentByEmail:', error);
      return null;
    }
  };

  const fetchAttendanceData = async (S_ID) => {
    try {
      const response = await fetch(`http://localhost:5555/api/attendance/student/${S_ID}`);
      const data = await response.json();

      let totalAttendedClasses = 0;
      let totalClasses = 0;

      const transformedData = await Promise.all(data.map(async (record, index) => {
        const courseResponse = await fetch(`http://localhost:5555/api/courses/${record.courseCode}`);
        const courseData = await courseResponse.json();

        const attendedClasses = record.attendance.filter(a => a.status === 'Present').length;
        const totalClassForCourse = record.attendance.length;
        totalAttendedClasses += attendedClasses;
        totalClasses += totalClassForCourse;

        return {
          sno: index + 1,
          courseCode: courseData.courseCode,
          courseTitle: courseData.courseTitle,
          courseType: courseData.courseType,
          attendedClasses,
          totalClasses: totalClassForCourse,
          attendancePercentage: totalClassForCourse === 0 
            ? 100 
            : ((attendedClasses / totalClassForCourse) * 100).toFixed(2),
          status: totalClassForCourse === 0 
            ? 'Regular' 
            : (attendedClasses / totalClassForCourse >= 0.75 ? 'Regular' : 'Irregular'),
        };
      }));

      const overallAttendance = totalClasses === 0 
        ? 0 
        : ((totalAttendedClasses / totalClasses) * 100).toFixed(2);

      setAttendanceData(transformedData);
      setOverallAttendance(overallAttendance);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };


  useEffect(() => {
    if (email) {
      getStudentByEmail(email).then(student => {
        if (student) {
          fetchAttendanceData(student.S_ID);
        }
      });
    }
  }, [email]);

  return (
    <div className="student-dashboard">
      <header>
        <div className="header-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>
            <h2>Student Dashboard</h2>
            <p>Welcome to the student dashboard! Check your attendance</p>
          </div>
          <div className="profile-section" style={{ position: "absolute", right: "4rem" }}>
            <i className="fa-solid fa-user-circle profile-icon" onClick={handleProfileClick} style={{ fontSize: "2.2rem" }}></i>
            {student && (
              <div className="profile-details">
                <p>{student.S_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="body">
        <div className="attendance-box">
          <h2>Current Semester Attendance</h2>
          <div className="attendance">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Course Type</th>
                  <th>Attended Classes</th>
                  <th>Total Classes</th>
                  <th>Attendance Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.sno}</td>
                    <td>{record.courseCode}</td>
                    <td>{record.courseTitle}</td>
                    <td>{record.courseType}</td>
                    <td>{record.attendedClasses}</td>
                    <td>{record.totalClasses}</td>
                    <td>{record.attendancePercentage}%</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Overall Attendance: {overallAttendance}%</h2>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentDashboard;
