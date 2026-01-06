import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('加载通知失败，请稍后重试 / Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation(); // Prevent navigation if we click the button
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id, { stopPropagation: () => {} });
    }

    // Navigate based on type
    if (notification.type === 'assignment') {
      // Assuming relatedId is assignmentId
      navigate('/assignments'); // Ideally navigate to specific assignment if supported
    } else if (notification.type === 'grade') {
      // Assuming relatedId is submissionId
      navigate('/assignments'); // Or to specific submission view
    } else if (notification.type === 'announcement') {
        // Stay here or go to course? relatedId is courseId
        navigate(`/courses/${notification.relatedId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) return <div className="loading">加载中... / Loading...</div>;

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h1>通知中心 / Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAllAsRead} className="btn btn-secondary">
            全部已读 / Mark All Read
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-data">暂无通知 / No notifications</div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <div className="notification-header">
                  <span className={`notification-type type-${notification.type}`}>
                    {notification.type === 'assignment' && '作业 / Assignment'}
                    {notification.type === 'grade' && '成绩 / Grade'}
                    {notification.type === 'announcement' && '公告 / Announcement'}
                    {notification.type === 'general' && '系统 / System'}
                  </span>
                  <span className="notification-time">{formatDate(notification.createdAt)}</span>
                </div>
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-message">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <button 
                  className="btn-icon" 
                  title="Mark as read"
                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                >
                  ✓
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .notifications-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .notification-item {
          background: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-left: 4px solid transparent;
        }
        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .notification-item.unread {
          border-left-color: #3498db;
          background: #f8f9fa;
        }
        .notification-item.read {
          opacity: 0.8;
          border-left-color: #bdc3c7;
        }
        .notification-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }
        .notification-type {
          font-size: 0.8em;
          padding: 2px 8px;
          border-radius: 12px;
          color: white;
        }
        .type-assignment { background-color: #e67e22; }
        .type-grade { background-color: #27ae60; }
        .type-announcement { background-color: #8e44ad; }
        .type-general { background-color: #7f8c8d; }
        
        .notification-time {
          font-size: 0.85em;
          color: #7f8c8d;
        }
        .notification-title {
          margin: 5px 0;
          font-size: 1.1em;
          color: #2c3e50;
        }
        .notification-message {
          margin: 0;
          color: #34495e;
          font-size: 0.95em;
          line-height: 1.4;
        }
        .btn-icon {
          background: none;
          border: none;
          color: #3498db;
          font-size: 1.2em;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
        }
        .btn-icon:hover {
          background-color: #ecf0f1;
        }
        .no-data {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
          font-size: 1.1em;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
