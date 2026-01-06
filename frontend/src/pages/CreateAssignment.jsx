import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignmentAPI } from '../services/api';

const CreateAssignment = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100,
    allowedFileTypes: 'pdf,doc,docx,md,mp4,avi,mov,ppt,pptx,xls,xlsx'
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
      await assignmentAPI.create({
        ...formData,
        courseId: parseInt(courseId)
      });
      navigate(`/course/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.error || '发布作业失败 / Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="mb-3">发布新作业 / Create New Assignment</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">作业标题 / Assignment Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="例如：期中作业 / e.g. Midterm Assignment"
            />
          </div>

          <div className="form-group">
            <label className="form-label">截止日期 / Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">满分 / Max Score</label>
            <input
              type="number"
              name="maxScore"
              value={formData.maxScore}
              onChange={handleChange}
              required
              min="0"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">允许的文件类型 / Allowed File Types</label>
            <input
              type="text"
              name="allowedFileTypes"
              value={formData.allowedFileTypes}
              onChange={handleChange}
              className="form-control"
              placeholder="pdf,doc,docx..."
            />
            <small className="text-muted">用逗号分隔 / Separated by commas</small>
          </div>

          <div className="form-group">
            <label className="form-label">作业描述 / Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="请输入作业描述... / Enter assignment description..."
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? '发布中... / Publishing...' : '发布作业 / Publish Assignment'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(`/course/${courseId}`)}
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

export default CreateAssignment;
