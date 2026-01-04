import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, assignmentAPI } from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCourseData();
    loadAssignments();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(id);
      setCourse(response.data);
      setEnrollments(response.data.enrollments || []);
    } catch (error) {
      console.error('Failed to load course:', error);
      alert('加载课程失败 / Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const response = await assignmentAPI.getAll(id);
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除此课程吗？此操作不可恢复！/ Are you sure you want to delete this course? This action cannot be undone!')) {
      return;
    }

    try {
      setDeleting(true);
      await courseAPI.delete(id);
      alert('课程删除成功！/ Course deleted successfully!');
      navigate('/courses');
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('删除失败，请重试 / Failed to delete, please try again');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isTeacher = user?.role === 'teacher';

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  if (!course) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <h3>课程不存在 / Course Not Found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/courses')}>
              返回课程列表 / Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/courses')}>
          ← 返回 / Back
        </button>
        {isTeacher && (
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/course/${id}/create-assignment`)}
            >
              发布作业 / Create Assignment
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              {deleting ? '删除中...' : '删除课程'}
            </button>
          </div>
        )}
      </div>

      <div className="course-detail">
        <div className="card">
          <div className="card-header">
            <h1>{course.code} - {course.name}</h1>
          </div>
          <div className="card-body">
            {course.description && (
              <div className="description">
                <h3>课程描述 / Course Description</h3>
                <p>{course.description}</p>
              </div>
            )}
            
            {course.teacher && (
              <div className="teacher-info">
                <h3>授课教师 / Instructor</h3>
                <p>{course.teacher.name}</p>
              </div>
            )}

            <div className="course-stats">
              <div className="stat-item">
                <strong>{enrollments.length}</strong>
                <span>已选修学生 / Enrolled Students</span>
              </div>
              <div className="stat-item">
                <strong>{assignments.length}</strong>
                <span>作业数量 / Assignments</span>
              </div>
            </div>
          </div>
        </div>

        {isTeacher && enrollments.length > 0 && (
          <div className="card">
            <div className="card-title">
              选修学生 / Enrolled Students ({enrollments.length})
            </div>
            <div className="list-group">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="list-item">
                  <strong>{enrollment.student?.name}</strong>
                  <span className="text-muted">({enrollment.student?.email})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-title">
            课程作业 / Course Assignments ({assignments.length})
            {loadingAssignments && <span className="loading-indicator"> 加载中...</span>}
          </div>
          {assignments.length === 0 ? (
            <div className="empty-state">
              <p>暂无作业 / No assignments yet</p>
              {isTeacher && (
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/course/${id}/create-assignment`)}
                >
                  创建第一个作业 / Create First Assignment
                </button>
              )}
            </div>
          ) : (
            <div className="list-group">
              {assignments.map(assignment => (
                <div key={assignment.id} className="list-item">
                  <div className="flex-between">
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{assignment.title}</h4>
                      {assignment.description && (
                        <p className="text-muted" style={{ margin: '0.25rem 0 0.5rem 0' }}>
                          {assignment.description}
                        </p>
                      )}
                      <div className="assignment-meta">
                        <span className="text-muted">
                          截止日期 / Due: {new Date(assignment.dueDate).toLocaleString('zh-CN')}
                        </span>
                        <span className="badge badge-info">
                          满分 / Max Score: {assignment.maxScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
