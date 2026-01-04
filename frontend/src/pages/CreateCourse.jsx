import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setError('请输入课程名称 / Please enter course name');
      return;
    }
    if (!formData.code.trim()) {
      setError('请输入课程代码 / Please enter course code');
      return;
    }

    try {
      setLoading(true);
      await courseAPI.create(formData);
      alert('课程创建成功！/ Course created successfully!');
      navigate('/courses');
    } catch (error) {
      console.error('Failed to create course:', error);
      setError(error.response?.data?.error || '创建失败，请重试 / Failed to create course, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>创建课程 / Create Course</h1>
      </div>

      <div className="card form-card">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">课程名称 / Course Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：计算机科学导论 / Example: Introduction to Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label className="required">课程代码 / Course Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="例如：CS101 / Example: CS101"
              required
            />
          </div>

          <div className="form-group">
            <label>课程描述 / Course Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="简要描述课程内容、目标受众等 / Brief description of course content, target audience, etc."
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '创建中... / Creating...' : '创建课程 / Create Course'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/courses')}
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

export default CreateCourse;
