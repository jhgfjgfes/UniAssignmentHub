import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classAPI, courseAPI } from '../services/api';

const CreateClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    courseId: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState('');

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
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('请输入班级名称 / Please enter class name');
      return;
    }
    if (!formData.courseId) {
      setError('请选择关联课程 / Please select a course');
      return;
    }

    try {
      setLoading(true);
      await classAPI.create(formData);
      alert('班级创建成功！/ Class created successfully!');
      navigate('/classes');
    } catch (error) {
      console.error('Failed to create class:', error);
      setError(error.response?.data?.error || '创建失败，请重试 / Failed to create class, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>创建班级 / Create Class</h1>
      </div>

      <div className="card form-card">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">班级名称 / Class Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：CS101-01班 / Example: CS101-01"
              required
            />
          </div>

          <div className="form-group">
            <label className="required">关联课程 / Related Course *</label>
            {loadingCourses ? (
              <div className="loading">加载课程中... / Loading courses...</div>
            ) : courses.length === 0 ? (
              <p className="text-muted">
                您还没有创建课程，请先创建课程 / You haven't created any courses yet, please create one first
              </p>
            ) : (
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
              >
                <option value="">-- 选择课程 / Select Course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>班级描述 / Class Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="简要描述班级信息 / Brief description of class information"
            />
          </div>

          <div className="info-box">
            <strong>提示 / Note:</strong> 班级创建后将自动生成班级码，学生可以通过班级码加入班级
            <br />
            <strong>Tip:</strong> A class code will be automatically generated after creation, students can join using the class code
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || courses.length === 0}
            >
              {loading ? '创建中... / Creating...' : '创建班级 / Create Class'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/classes')}
              disabled={loading}
            >
              取消 / Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
