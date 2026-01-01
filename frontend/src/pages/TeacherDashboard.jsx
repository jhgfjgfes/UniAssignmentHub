import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>欢迎, {user.name} 老师!</h1>
      <p className="text-muted">Welcome to your teacher dashboard</p>

      <div className="card">
        <div className="card-title">快速操作 / Quick Actions</div>
        <div className="grid grid-3">
          <Link to="/courses" className="btn btn-primary">
            我的课程 / My Courses
          </Link>
          <Link to="/classes" className="btn btn-primary">
            我的班级 / My Classes
          </Link>
          <Link to="/create-course" className="btn btn-success">
            创建课程 / Create Course
          </Link>
          <Link to="/create-class" className="btn btn-success">
            创建班级 / Create Class
          </Link>
          <Link to="/assignments" className="btn btn-primary">
            作业管理 / Manage Assignments
          </Link>
          <Link to="/notifications" className="btn btn-warning">
            通知中心 / Notifications
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-title">教师功能 / Teacher Features</div>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✓ 创建和管理课程 / Create and manage courses</li>
          <li>✓ 创建和管理班级 / Create and manage classes</li>
          <li>✓ 发布作业 / Publish assignments</li>
          <li>✓ 批改和评分学生作业 / Grade and review student submissions</li>
          <li>✓ 上传教学资料 / Upload teaching materials</li>
          <li>✓ 向学生发送通知 / Send announcements to students</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
