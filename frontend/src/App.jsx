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
        <Route path="/classes" element={<PrivateRoute><div className="container"><h1>班级 / Classes</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><div className="container"><h1>通知 / Notifications</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/browse-courses" element={<PrivateRoute><div className="container"><h1>选课 / Browse Courses</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/create-course" element={<PrivateRoute><div className="container"><h1>创建课程 / Create Course</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/create-class" element={<PrivateRoute><div className="container"><h1>创建班级 / Create Class</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/submissions" element={<PrivateRoute><div className="container"><h1>我的提交 / My Submissions</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/course/:id" element={<PrivateRoute><div className="container"><h1>课程详情 / Course Details</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
        <Route path="/course/:id/create-assignment" element={<PrivateRoute><div className="container"><h1>发布作业 / Create Assignment</h1><div className="card"><p>功能开发中 / Feature in development</p></div></div></PrivateRoute>} />
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
