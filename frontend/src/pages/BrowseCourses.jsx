import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../services/api';

const BrowseCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        courseAPI.getAll(),
        courseAPI.getMyCourses()
      ]);
      setCourses(allRes.data);
      setMyCourseIds(myRes.data.map(c => c.id));
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      await courseAPI.enroll(courseId);
      setMyCourseIds([...myCourseIds, courseId]);
      alert('选课成功！/ Course enrolled successfully!');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('选课失败，请重试 / Failed to enroll, please try again');
    } finally {
      setEnrolling(null);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('确定要退选这门课程吗？/ Are you sure you want to unenroll?')) return;
    
    try {
      setEnrolling(courseId);
      await courseAPI.unenroll(courseId);
      setMyCourseIds(myCourseIds.filter(id => id !== courseId));
      alert('退选成功！/ Course unenrolled successfully!');
    } catch (error) {
      console.error('Failed to unenroll:', error);
      alert('退选失败，请重试 / Failed to unenroll, please try again');
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId) => myCourseIds.includes(courseId);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>浏览课程 / Browse Courses</h1>
        <input
          type="text"
          className="search-input"
          placeholder="搜索课程名称、代码或描述 / Search courses by name, code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>未找到课程 / No Courses Found</h3>
            <p>没有匹配的课程 / No courses match your search</p>
          </div>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map(course => {
            const enrolled = isEnrolled(course.id);
            return (
              <div key={course.id} className="card course-card">
                <div className="card-header">
                  <h3>{course.code}</h3>
                  {enrolled && (
                    <span className="badge badge-success">已选课 / Enrolled</span>
                  )}
                </div>
                <div className="card-body">
                  <h4>{course.name}</h4>
                  {course.description && (
                    <p className="text-muted">{course.description}</p>
                  )}
                  {course.teacher && (
                    <p className="text-muted">
                      教师 / Teacher: {course.teacher.name}
                    </p>
                  )}
                </div>
                <div className="card-footer">
                  {enrolled ? (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleUnenroll(course.id)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? '处理中...' : '退选课程'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? '处理中...' : '选修课程'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
