import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../services/api';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudentInput, setNewStudentInput] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const response = await courseAPI.getCourse(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Failed to load course:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentInput) return;

    setAddingStudent(true);
    try {
      const isEmail = newStudentInput.includes('@');
      const data = isEmail ? { email: newStudentInput } : { username: newStudentInput };

      await courseAPI.addStudent(id, data);
      setNewStudentInput('');
      alert('Student added successfully');
    } catch (error) {
      console.error('Failed to add student:', error);
      alert(error.response?.data?.error || 'Failed to add student');
    } finally {
      setAddingStudent(false);
    }
  };

  if (loading) return <div className="loading">加载中... / Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="container">
      <div className="card mb-3">
        <h1>{course.name}</h1>
        <p className="text-muted">课程代码 / Code: {course.code}</p>
        {course.description && <p>{course.description}</p>}
        {course.teacher && (
          <p><strong>教师 / Teacher:</strong> {course.teacher.name} ({course.teacher.email})</p>
        )}
      </div>

      {user.role === 'teacher' && (
        <div className="card mb-3">
          <h3>添加学生 / Add Student</h3>
          <form onSubmit={handleAddStudent} className="flex gap-2">
            <input
              type="text"
              placeholder="输入学生邮箱或用户名 / Enter email or username"
              value={newStudentInput}
              onChange={(e) => setNewStudentInput(e.target.value)}
              className="form-control"
              required
            />
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={addingStudent}
            >
              {addingStudent ? '添加中...' : '添加 / Add'}
            </button>
          </form>
        </div>
      )}

      <div className="flex-between mb-2">
        <h2>作业 / Assignments</h2>
        {user.role === 'teacher' && (
          <Link to={`/course/${course.id}/create-assignment`} className="btn btn-success">
            + 发布作业 / Create Assignment
          </Link>
        )}
      </div>

      {course.assignments && course.assignments.length > 0 ? (
        <div className="grid grid-1">
          {course.assignments.map(assignment => (
            <div key={assignment.id} className="card">
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p className="text-muted">截止日期 / Due: {new Date(assignment.dueDate).toLocaleString()}</p>
              <Link to={`/assignments?courseId=${course.id}`} className="btn btn-primary">
                前往作业列表 / Go to Assignments
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">暂无作业 / No assignments yet</p>
      )}
    </div>
  );
};

export default CourseDetails;
