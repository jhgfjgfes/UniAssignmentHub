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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await courseAPI.create(formData);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.error || '创建课程失败 / Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="mb-3">创建新课程 / Create New Course</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">课程名称 / Course Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="例如：高级Web开发 / e.g. Advanced Web Development"
            />
          </div>

          <div className="form-group">
            <label className="form-label">课程代码 / Course Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="例如：CS301 / e.g. CS301"
            />
            <small className="text-muted">课程代码必须唯一 / Course code must be unique</small>
          </div>

          <div className="form-group">
            <label className="form-label">课程描述 / Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="请输入课程描述... / Enter course description..."
            />
          </div>

          <div className="flex gap-2 mt-3">
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
