import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, assignmentAPI } from '../services/api';

const CreateAssignment = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'md']
  });
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoadingCourse(true);
      const response = await courseAPI.getCourse(courseId);
      setCourse(response.data);
    } catch (error) {
      console.error('Failed to load course:', error);
      alert('加载课程失败 / Failed to load course');
      navigate('/courses');
    } finally {
      setLoadingCourse(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileTypeToggle = (type) => {
    setFormData({
      ...formData,
      allowedFileTypes: formData.allowedFileTypes.includes(type)
        ? formData.allowedFileTypes.filter(t => t !== type)
        : [...formData.allowedFileTypes, type]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('请输入作业标题 / Please enter assignment title');
      return;
    }
    if (!formData.dueDate) {
      setError('请选择截止日期 / Please select due date');
      return;
    }
    if (formData.maxScore <= 0) {
      setError('满分必须大于0 / Max score must be greater than 0');
      return;
    }
    if (formData.allowedFileTypes.length === 0) {
      setError('请至少选择一种允许的文件类型 / Please select at least one allowed file type');
      return;
    }

    try {
      setLoading(true);
      await assignmentAPI.create({
        ...formData,
        courseId,
        allowedFileTypes: formData.allowedFileTypes.join(',')
      });
      alert('作业发布成功！系统已自动向所有选修学生发送通知。/ Assignment published successfully! Notification has been sent to all enrolled students.');
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      setError(error.response?.data?.error || '发布失败，请重试 / Failed to publish, please try again');
    } finally {
      setLoading(false);
    }
  };

  const FILE_TYPES = [
    { value: 'pdf', label: 'PDF (.pdf)' },
    { value: 'doc', label: 'Word (.doc)' },
    { value: 'docx', label: 'Word (.docx)' },
    { value: 'md', label: 'Markdown (.md)' },
    { value: 'mp4', label: 'Video (.mp4)' },
    { value: 'avi', label: 'Video (.avi)' },
    { value: 'mov', label: 'Video (.mov)' },
    { value: 'ppt', label: 'PowerPoint (.ppt)' },
    { value: 'pptx', label: 'PowerPoint (.pptx)' },
    { value: 'xls', label: 'Excel (.xls)' },
    { value: 'xlsx', label: 'Excel (.xlsx)' }
  ];

  if (loadingCourse) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>发布作业 / Create Assignment</h1>
        <button className="btn btn-secondary" onClick={() => navigate(`/course/${courseId}`)}>
          ← 返回课程 / Back to Course
        </button>
      </div>

      {course && (
        <div className="course-breadcrumb">
          {course.code} - {course.name}
        </div>
      )}

      <div className="card form-card">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">作业标题 / Assignment Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例如：第一章习题 / Example: Chapter 1 Exercises"
              required
            />
          </div>

          <div className="form-group">
            <label>作业描述 / Assignment Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="详细描述作业要求、评分标准等 / Detailed description of assignment requirements, grading criteria, etc."
            />
          </div>

          <div className="form-group">
            <label className="required">截止日期 / Due Date *</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="form-group">
            <label className="required">满分 / Maximum Score *</label>
            <input
              type="number"
              name="maxScore"
              value={formData.maxScore}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="required">允许的文件类型 / Allowed File Types *</label>
            <div className="checkbox-group">
              {FILE_TYPES.map(type => (
                <label key={type.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.allowedFileTypes.includes(type.value)}
                    onChange={() => handleFileTypeToggle(type.value)}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="info-box">
            <strong>💡 提示 / Tip:</strong> 作业发布后，系统会自动向所有选修该课程的学生发送通知，通知他们有新的作业需要完成
            <br />
            <strong>Tip:</strong> After publishing, the system will automatically send notifications to all enrolled students about the new assignment
          </div>

          <div className="form-actions">
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
