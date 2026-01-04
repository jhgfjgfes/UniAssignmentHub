import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import Materials from './pages/Materials';
import Notifications from './pages/Notifications';
import BrowseCourses from './pages/BrowseCourses';
import CreateCourse from './pages/CreateCourse';
import CreateClass from './pages/CreateClass';
import MySubmissions from './pages/MySubmissions';
import CourseDetail from './pages/CourseDetail';
import CreateAssignment from './pages/CreateAssignment';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">加载中... / Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === 'student' ? <StudentDashboard /> : <TeacherDashboard />;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
        <Route path="/assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
        <Route path="/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
        <Route path="/class/:id" element={<PrivateRoute><ClassDetail /></PrivateRoute>} />
        <Route path="/class/:id/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/browse-courses" element={<PrivateRoute><BrowseCourses /></PrivateRoute>} />
        <Route path="/create-course" element={<PrivateRoute><CreateCourse /></PrivateRoute>} />
        <Route path="/create-class" element={<PrivateRoute><CreateClass /></PrivateRoute>} />
        <Route path="/submissions" element={<PrivateRoute><MySubmissions /></PrivateRoute>} />
        <Route path="/course/:id" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />
        <Route path="/course/:id/create-assignment" element={<PrivateRoute><CreateAssignment /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
