import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './markAttendance.css';

const MarkAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [faculty, setFaculty] = useState(null);
  const [formData, setFormData] = useState({
    class: "",
    course: "",
  });
  const [courseOptions, setCourseOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });
  const [currentDate, setCurrentDate] = useState("");
  const [error, setError] = useState("");

  const handleProfileClick = () => {
    navigate('/ProfilePage', { state: { user: 'faculty', email: email } });
  };

  const getFacultyByEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:5555/api/faculty/byEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching faculty: ${response.statusText}`);
      }

      const data = await response.json();
      setFaculty(data);
      setCourseOptions(data.courseCode);
      setClassOptions(data.classId); 
      return data;
    } catch (error) {
      console.error('Error in getFacultyByEmail:', error);
      return null;
    }
  };

  const getStudentsByClassId = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5555/api/class/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching class data: ${response.statusText}`);
      }

      const classData = await response.json();
      const { S_ID } = classData;

      // Fetch student details
      const studentsPromises = S_ID.map(async (id) => {
        const studentResponse = await fetch(`http://localhost:5555/api/student/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!studentResponse.ok) {
          throw new Error(`Error fetching student data for ID ${id}: ${studentResponse.statusText}`);
        }

        const studentData = await studentResponse.json();
        return studentData;
      });

      const studentsData = await Promise.all(studentsPromises);
      return studentsData;
    } catch (error) {
      console.error('Error in getStudentsByClassId:', error);
      return null;
    }
  };

  const markAttendance = async (attendanceRecords) => {
    try {
      const responses = await Promise.all(attendanceRecords.map(async (record) => {
        const response = await fetch(`http://localhost:5555/api/attendance/mark/${record.S_ID}/${record.courseCode}/${record.classId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: new Date().toISOString(),
            status: record.status,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error marking attendance for ID ${record.S_ID}: ${response.statusText}`);
        }

        return response.json();
      }));

      return responses;
    } catch (error) {
      console.error('Error in markAttendance:', error);
      return null;
    }
  };

  useEffect(() => {
    if (email) {
      getFacultyByEmail(email);
    }
  }, [email]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFetchStudents = async () => {
    const { class: classId, course: courseCode } = formData;

    if (!classId || !courseCode) {
      setError("Both class and course must be selected.");
      return;
    }

    const studentsData = await getStudentsByClassId(classId);
    if (!studentsData || !studentsData.length) {
      setError("Invalid class or no students found.");
      return;
    }

    setError("");

    const studentData = studentsData.map(student => ({
      S_ID: student.S_ID,
      Name: student.S_NAME,
      status: 'Present'
    }));

    setStudents(studentsData);
    setAttendanceData(studentData);
  };

  const handleAttendanceClick = (index) => {
    setAttendanceData(prevData =>
      prevData.map((record, i) =>
        i === index ? { ...record, status: record.status === 'Present' ? 'Absent' : 'Present' } : record
      )
    );
  };

  const handleFinalSubmit = async () => {
    const { class: classId, course: courseCode } = formData;

    const attendanceRecords = attendanceData.map(record => ({
      S_ID: record.S_ID,
      courseCode,
      classId,
      date: new Date().toISOString(),
      status: record.status,
    }));

    const results = await markAttendance(attendanceRecords);

    if (results) {
      const total = attendanceData.length;
      const present = attendanceData.filter(record => record.status === 'Present').length;
      const absent = attendanceData.filter(record => record.status === 'Absent').length;

      setAttendanceSummary({
        total,
        present,
        absent,
      });

      alert('Attendance data successfully uploaded!');
    }
  };

  return (
    <div className="mark-attendance">
      <header>
        <div className="header-content" >
          <div>
            <h2>Mark Attendance</h2>
            <p>Recheck class before marking attendance...</p>
          </div>
          <div className="profile-section">
            <i className="fa-solid fa-user-circle profile-icon" onClick={handleProfileClick} style={{ fontSize: "2.2rem" }}></i>
            {faculty && (
              <div className="profile-details">
                <p>{faculty.F_NAME}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="body">
        <form className="form">
          <p>Date: {currentDate}</p>
          <div className="form-group">
            <label htmlFor="class">Class:</label>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
            >
              <option value="">Select Class</option>
              {classOptions.map((classId, index) => (
                <option key={index} value={classId}>{classId}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="course">Course:</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
            >
              <option value="">Select Course</option>
              {courseOptions.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>
          <button type="button" onClick={handleFetchStudents} className="fetch-students-button">Fetch Students</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        {students.length > 0 && (
          <div className="attendance-box">
            <div className="attendance">
              <table>
                <thead>
                  <tr>
                    <th>RollNo</th>
                    <th>Name</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.S_ID}</td>
                      <td>{record.Name}</td>
                      <td>
                        <button
                          className={`attendance-button ${record.status}`}
                          onClick={() => handleAttendanceClick(index)}
                          style={{ backgroundColor: record.status === 'Absent' ? 'red' : '' }}
                        >
                          {record.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleFinalSubmit} className="submit-button">Submit</button>
              <div className="attendance-summary">
                <p>Total Students: {attendanceSummary.total}</p>
                <p>Present: {attendanceSummary.present}</p>
                <p>Absent: {attendanceSummary.absent}</p>
              </div>
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

export default MarkAttendance;
