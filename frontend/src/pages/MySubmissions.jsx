import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submissionAPI, assignmentAPI } from '../services/api';

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, graded, ungraded
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [submissionsRes] = await Promise.all([
        submissionAPI.getMy()
      ]);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      setDownloading(id);
      const response = await submissionAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
      alert('下载失败，请重试 / Failed to download, please try again');
    } finally {
      setDownloading(null);
    }
  };

  const getFilteredSubmissions = () => {
    if (filter === 'graded') {
      return submissions.filter(s => s.grade !== null);
    } else if (filter === 'ungraded') {
      return submissions.filter(s => s.grade === null);
    }
    return submissions;
  };

  const getStatusBadge = (submission) => {
    if (submission.grade !== null) {
      const percentage = (submission.grade / submission.maxScore) * 100;
      let badgeClass = 'badge-warning';
      if (percentage >= 90) badgeClass = 'badge-success';
      else if (percentage >= 70) badgeClass = 'badge-info';
      
      return (
        <span className={`badge ${badgeClass}`}>
          已评分: {submission.grade}/{submission.maxScore} / Graded: {submission.grade}/{submission.maxScore}
        </span>
      );
    }
    return <span className="badge badge-secondary">待评分 / Pending</span>;
  };

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <div className="container">
      <div className="page-header">
        <h1>我的提交 / My Submissions</h1>
        <div className="filter-buttons">
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            全部 ({submissions.length})
          </button>
          <button 
            className={`btn ${filter === 'graded' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('graded')}
          >
            已评分 ({submissions.filter(s => s.grade !== null).length})
          </button>
          <button 
            className={`btn ${filter === 'ungraded' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('ungraded')}
          >
            待评分 ({submissions.filter(s => s.grade === null).length})
          </button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>暂无提交 / No Submissions</h3>
            <p>您还没有提交任何作业 / You haven't submitted any assignments yet</p>
          </div>
        </div>
      ) : (
        <div className="list-group">
          {filteredSubmissions.map(submission => (
            <div key={submission.id} className="list-item">
              <div className="flex-between">
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>
                      {submission.assignment?.course?.code} - {submission.assignment?.title}
                    </h4>
                    {getStatusBadge(submission)}
                  </div>
                  {submission.feedback && (
                    <div className="feedback-box">
                      <strong>教师反馈 / Teacher Feedback:</strong>
                      <p style={{ margin: '0.25rem 0 0 0' }}>{submission.feedback}</p>
                    </div>
                  )}
                  <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                    <div>
                      <p className="text-muted" style={{ margin: 0 }}>
                        文件: {submission.filename}
                      </p>
                      <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                        提交时间: {new Date(submission.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleDownload(submission.id, submission.filename)}
                      disabled={downloading === submission.id}
                    >
                      {downloading === submission.id ? '下载中...' : '下载'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
