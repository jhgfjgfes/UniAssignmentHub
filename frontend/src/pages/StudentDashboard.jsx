import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, notificationAPI } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [unsubmittedAssignments, setUnsubmittedAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsRes, notificationsRes] = await Promise.all([
        assignmentAPI.getUnsubmitted(),
        notificationAPI.getUnread()
      ]);
      
      setUnsubmittedAssignments(assignmentsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中... / Loading...</div>;
  }

  return (
    <div className="container">
      <h1>欢迎, {user.name}!</h1>
      <p className="text-muted">Welcome to your dashboard</p>

      {/* Unsubmitted Assignments Alert - PROMINENT */}
      {unsubmittedAssignments.length > 0 && (
        <div className="unsubmitted-alert">
          <div className="unsubmitted-count">{unsubmittedAssignments.length}</div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>未提交作业 / Unsubmitted Assignments</h2>
          <p style={{ margin: 0 }}>您有 {unsubmittedAssignments.length} 个作业未提交！请尽快完成。</p>
          <p style={{ margin: 0 }}>You have {unsubmittedAssignments.length} unsubmitted assignment(s)! Please complete them soon.</p>
          <Link to="/assignments" className="btn btn-warning mt-2">
            查看未提交作业 / View Unsubmitted Assignments
          </Link>
        </div>
      )}

      {unsubmittedAssignments.length === 0 && (
        <div className="alert alert-success">
          <strong>太棒了！/ Great!</strong> 您已完成所有作业 / You have completed all assignments!
        </div>
      )}

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="card">
          <div className="card-title">
            最新通知 / Recent Notifications
            <span className="badge badge-danger">{notifications.length} 未读</span>
          </div>
          <div className="list-group">
            {notifications.slice(0, 5).map(notification => (
              <div key={notification.id} className="list-item">
                <div className="flex-between">
                  <div>
                    <strong>{notification.title}</strong>
                    <p className="text-muted" style={{ margin: '0.25rem 0 0 0' }}>
                      {notification.message}
                    </p>
                  </div>
                  <span className={`badge badge-${notification.type === 'assignment' ? 'danger' : 'info'}`}>
                    {notification.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/notifications" className="btn btn-primary mt-2">
            查看所有通知 / View All Notifications
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <div className="card-title">快速操作 / Quick Actions</div>
        <div className="grid grid-3">
          <Link to="/courses" className="btn btn-primary">
            我的课程 / My Courses
          </Link>
          <Link to="/assignments" className="btn btn-primary">
            我的作业 / My Assignments
          </Link>
          <Link to="/submissions" className="btn btn-primary">
            我的提交 / My Submissions
          </Link>
          <Link to="/classes" className="btn btn-secondary">
            我的班级 / My Classes
          </Link>
          <Link to="/browse-courses" className="btn btn-success">
            选课 / Browse Courses
          </Link>
          <Link to="/notifications" className="btn btn-warning">
            通知中心 / Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
