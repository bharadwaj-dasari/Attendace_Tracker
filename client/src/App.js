import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext';
import LandingPage from './pages/landingPage';
import UserSelection from './pages/userSelection';
import Login from './pages/login';
import Signup from './pages/signup';
import StudentDashboard from './pages/student/studentDashboard';
import StudentSignUp from './pages/student/studentSignUp';
import FacultyDashboard from './pages/faculty/facultyDashboard';
import FacultySignUp from './pages/faculty/facultySignUp';
import MarkAttendance from './pages/faculty/markAttendance';
import CheckClassAttendance from './pages/faculty/checkClassAttendance';
import CheckStudentAttendance from './pages/faculty/checkStudentAttendance';
import AdminDashboard from './pages/admin/adminDashboard';
import AdminSignUp from './pages/admin/adminSignUp';
import ManageCollage from './pages/admin/manageCollage';
import CheckAttendance from './pages/admin/checkAttendance';
import ManageClass from './pages/admin/manageClass';
import ManageFaculty from './pages/admin/manageFaculty';
import ManageCourses from './pages/admin/manageCourses';
import ManageStudent from './pages/admin/manageStudent';
import ProfilePage from './pages/components/profilePage';
import AssignFacultyToClass from './pages/admin/assignFacultyToClass';
import AssignCoursesToClass from './pages/admin/assignCoursesToClass';
import AssignCoursesToFaculty from './pages/admin/assignCourses';
import ViewClass from './pages/admin/viewClass';
import NotAuthorized from './pages/notAuthorized';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { authState } = useAuth();
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(authState.role)) {
    return <Navigate to="/not-authorized" />;
  }
  return element;
};

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/userSelection" element={<UserSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ProfilePage" element={<ProfilePage/>} />
          <Route path="/login/student/studentSignUp" element={<StudentSignUp />} />
          <Route path="/login/faculty/facultySignUp" element={<FacultySignUp />} />
          <Route path="/login/admin/adminSignUp" element={<AdminSignUp />} />
          <Route
            path="/student/studentDashboard"
            element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={['student']} />}
          />
          <Route
            path="/faculty/facultyDashboard"
            element={<ProtectedRoute element={<FacultyDashboard />} allowedRoles={['faculty']} />}
          />
          <Route
            path="/faculty/markAttendance"
            element={<ProtectedRoute element={<MarkAttendance />} allowedRoles={['faculty']} />}
          />
          <Route
            path="/checkClassAttendance"
            element={<ProtectedRoute element={<CheckClassAttendance />} allowedRoles={['faculty', 'admin']} />}
          />
          <Route
            path="/checkStudentAttendance"
            element={<ProtectedRoute element={<CheckStudentAttendance />} allowedRoles={['faculty', 'admin']} />}
          />
          <Route
            path="/admin/adminDashboard"
            element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />}
          />
          <Route
            path="/admin/manageCollage"
            element={<ProtectedRoute element={<ManageCollage/>} allowedRoles={['admin']} />}
          />
          <Route
            path="/manageClass"
            element={<ProtectedRoute element={<ManageClass/>} allowedRoles={['admin']} />}
          />
          <Route path="manageClass/admin/view-class" element={<ViewClass/>}/>
          <Route path="manageClass/admin/assign-faculty/" element={<AssignFacultyToClass />} />
          <Route path="manageClass/admin/assign-courses/" element={<AssignCoursesToClass />} />
          <Route path="manageClass/faculty/assign-courses/" element={<AssignCoursesToFaculty/>}/>
          <Route
            path="/manageFaculty"
            element={<ProtectedRoute element={<ManageFaculty/>} allowedRoles={['admin']} />}
          />
          <Route
            path="/manageCourses"
            element={<ProtectedRoute element={<ManageCourses/>} allowedRoles={['admin']} />}
          />
          <Route
            path="/manageStudent"
            element={<ProtectedRoute element={<ManageStudent/>} allowedRoles={['admin']} />}
          />
          <Route
            path="/admin/checkAttendance"
            element={<ProtectedRoute element={<CheckAttendance />} allowedRoles={['admin']} />}
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
