import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        UniAssignmentHub
      </Link>
      
      <ul className="navbar-nav">
        <li>
          <Link to="/dashboard" className="nav-link">
            首页 / Home
          </Link>
        </li>
        <li>
          <Link to="/courses" className="nav-link">
            课程 / Courses
          </Link>
        </li>
        <li>
          <Link to="/assignments" className="nav-link">
            作业 / Assignments
          </Link>
        </li>
        <li>
          <Link to="/classes" className="nav-link">
            班级 / Classes
          </Link>
        </li>
        <li>
          <Link to="/notifications" className="nav-link">
            通知 / Notifications
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
        </li>
        <li>
          <span className="nav-link" style={{ cursor: 'default' }}>
            {user.name} ({user.role === 'student' ? '学生' : '教师'})
          </span>
        </li>
        <li>
          <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            退出 / Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
