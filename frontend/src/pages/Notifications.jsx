import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === 'unread' ? '?unreadOnly=true' : '';
      const response = await notificationAPI.getAll();
      let data = response.data;
      
      if (filter === 'unread') {
        data = data.filter(n => !n.isRead);
      }
      
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      assignment: 'danger',
      grading: 'warning',
      announcement: 'info',
      system: 'secondary'
    };
    return badges[type] || 'primary';
  };

  const getTypeLabel = (type) => {
    const labels = {
      assignment: '作业 / Assignment',
      grading: '批改 / Grading',
      announcement: '公告 / Announcement',
      system: '系统 / System'
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container">
      <div className="page-header">
        <h1>通知中心 / Notification Center</h1>
        <div className="flex-between">
          <div className="filter-buttons">
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              全部 ({notifications.length})
            </button>
            <button 
              className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('unread')}
            >
              未读 ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-success" onClick={markAllAsRead}>
              全部标为已读 / Mark All as Read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>暂无通知 / No Notifications</h3>
            <p>您目前没有通知 / You don't have any notifications</p>
          </div>
        </div>
      ) : (
        <div className="list-group">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`list-item ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="flex-between">
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>
                      {!notification.isRead && <span className="badge badge-danger">未读 / New</span>}
                      <span style={{ marginLeft: '0.5rem' }}>{notification.title}</span>
                    </h4>
                    <span className={`badge badge-${getTypeBadge(notification.type)}`}>
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0' }}>{notification.message}</p>
                  <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>
                    {new Date(notification.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                {!notification.isRead && (
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => markAsRead(notification.id)}
                    style={{ marginLeft: '1rem' }}
                  >
                    标记已读
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
