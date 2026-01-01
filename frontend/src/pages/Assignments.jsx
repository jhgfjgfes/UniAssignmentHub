import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, courseAPI, submissionAPI } from '../services/api';

const Assignments = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadAssignments();
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getMyCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await assignmentAPI.getAll(selectedCourse);
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const handleFileSelect = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({ assignmentId, file });
    }
  };

  const handleSubmit = async (assignmentId) => {
    if (!selectedFile || selectedFile.assignmentId !== assignmentId) {
      alert('请选择文件 / Please select a file');
      return;
    }

    setSubmitting(assignmentId);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile.file);
      formData.append('assignmentId', assignmentId);

      await submissionAPI.submit(formData);
      alert('作业提交成功！ / Assignment submitted successfully!');
      setSelectedFile(null);
      loadAssignments();
    } catch (error) {
      console.error('Failed to submit:', error);
      alert(error.response?.data?.error || '提交失败 / Submission failed');
    } finally {
      setSubmitting(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="loading">加载中... / Loading...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="container">
        <h1>作业 / Assignments</h1>
        <div className="card text-center">
          <p>您还没有选修任何课程 / You haven't enrolled in any courses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>作业 / Assignments</h1>

      <div className="card">
        <div className="form-group">
          <label className="form-label">选择课程 / Select Course</label>
          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted">该课程暂无作业 / No assignments for this course yet</p>
        </div>
      ) : (
        <div>
          {assignments.map(assignment => (
            <div key={assignment.id} className="card">
              <div className="flex-between">
                <div>
                  <h3>{assignment.title}</h3>
                  {assignment.hasSubmitted ? (
                    <span className="badge badge-success">已提交 / Submitted</span>
                  ) : isOverdue(assignment.dueDate) ? (
                    <span className="badge badge-danger">已逾期 / Overdue</span>
                  ) : (
                    <span className="badge badge-warning">未提交 / Not Submitted</span>
                  )}
                </div>
                <div>
                  <p className="text-muted">截止日期 / Due: {formatDate(assignment.dueDate)}</p>
                  <p className="text-muted">满分 / Max Score: {assignment.maxScore}</p>
                </div>
              </div>

              {assignment.description && (
                <p style={{ marginTop: '1rem' }}>{assignment.description}</p>
              )}

              <p className="text-muted">
                支持的文件类型 / Allowed file types: {assignment.allowedFileTypes}
              </p>

              {user.role === 'student' && !assignment.hasSubmitted && (
                <div className="mt-2">
                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(e, assignment.id)}
                    className="form-input"
                  />
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    className="btn btn-primary mt-1"
                    disabled={submitting === assignment.id}
                  >
                    {submitting === assignment.id ? '提交中...' : '提交作业 / Submit'}
                  </button>
                </div>
              )}

              {assignment.hasSubmitted && assignment.submission && (
                <div className="alert alert-success mt-2">
                  <p><strong>已提交 / Submitted</strong></p>
                  <p>文件 / File: {assignment.submission.fileName}</p>
                  <p>提交时间 / Submitted at: {formatDate(assignment.submission.submittedAt)}</p>
                  {assignment.submission.status === 'graded' && (
                    <>
                      <p><strong>成绩 / Score: {assignment.submission.score} / {assignment.maxScore}</strong></p>
                      {assignment.submission.feedback && (
                        <p>反馈 / Feedback: {assignment.submission.feedback}</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;
