import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../services/api';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getMyCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中... / Loading...</div>;
  }

  return (
    <div className="container">
      <div className="flex-between mb-3">
        <h1>{user.role === 'teacher' ? '我教的课程' : '我的课程'} / My Courses</h1>
        {user.role === 'teacher' && (
          <Link to="/create-course" className="btn btn-success">
            + 创建课程 / Create Course
          </Link>
        )}
        {user.role === 'student' && (
          <Link to="/browse-courses" className="btn btn-success">
            + 选课 / Browse Courses
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted">
            {user.role === 'teacher' 
              ? '您还没有创建任何课程 / You haven\'t created any courses yet'
              : '您还没有选修任何课程 / You haven\'t enrolled in any courses yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {courses.map(course => (
            <div key={course.id} className="card">
              <h3>{course.name}</h3>
              <p className="text-muted">课程代码 / Code: {course.code}</p>
              {course.description && <p>{course.description}</p>}
              {course.teacher && (
                <p className="text-muted">
                  教师 / Teacher: {course.teacher.name}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Link to={`/course/${course.id}`} className="btn btn-primary">
                  查看详情 / View Details
                </Link>
                {user.role === 'teacher' && (
                  <Link to={`/course/${course.id}/create-assignment`} className="btn btn-success">
                    发布作业 / Create Assignment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
