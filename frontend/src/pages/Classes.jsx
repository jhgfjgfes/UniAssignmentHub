import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classAPI } from '../services/api';

const Classes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getMyClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    setError('');

    if (!classCode.trim()) {
      setError('请输入班级码 / Please enter class code');
      return;
    }

    try {
      setJoining(true);
      await classAPI.joinClass({ code: classCode });
      alert('加入班级成功！/ Joined class successfully!');
      setShowJoinModal(false);
      setClassCode('');
      loadClasses();
    } catch (error) {
      console.error('Failed to join class:', error);
      setError(error.response?.data?.error || '加入失败，请检查班级码 / Failed to join, please check the class code');
    } finally {
      setJoining(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('确定要删除此班级吗？/ Are you sure you want to delete this class?')) return;

    try {
      await classAPI.delete(classId);
      alert('班级删除成功！/ Class deleted successfully!');
      loadClasses();
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('删除失败，请重试 / Failed to delete, please try again');
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>我的班级 / My Classes</h1>
        {isTeacher && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-class')}
          >
            创建班级 / Create Class
          </button>
        )}
        {!isTeacher && (
          <button 
            className="btn btn-success"
            onClick={() => setShowJoinModal(true)}
          >
            加入班级 / Join Class
          </button>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>暂无班级 / No Classes Yet</h3>
            <p>您还没有加入任何班级 / You haven't joined any classes yet</p>
            {isTeacher ? (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/create-class')}
              >
                创建第一个班级 / Create First Class
              </button>
            ) : (
              <button 
                className="btn btn-success"
                onClick={() => setShowJoinModal(true)}
              >
                加入班级 / Join Class
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="class-grid">
          {classes.map(cls => (
            <div key={cls.id} className="card class-card">
              <div className="card-header">
                <h3>{cls.name}</h3>
                <span className="badge badge-info">
                  {cls.course?.code || 'N/A'}
                </span>
              </div>
              <div className="card-body">
                {cls.description && (
                  <p className="text-muted">{cls.description}</p>
                )}
                {cls.course && (
                  <p className="text-muted">
                    关联课程 / Course: {cls.course.name}
                  </p>
                )}
                <p className="text-muted">
                  {cls.teacher ? `教师 / Teacher: ${cls.teacher.name}` : ''}
                </p>
                <p className="text-muted">
                  班级码 / Class Code: <code>{cls.code}</code>
                </p>
              </div>
              <div className="card-footer">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/class/${cls.id}`)}
                >
                  查看详情 / View Details
                </button>
                {isTeacher && (
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClass(cls.id)}
                  >
                    删除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>加入班级 / Join Class</h2>
              <button className="modal-close" onClick={() => {
                setShowJoinModal(false);
                setClassCode('');
                setError('');
              }}>×</button>
            </div>
            <form onSubmit={handleJoinClass}>
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              <div className="form-group">
                <label className="required">班级码 / Class Code *</label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="输入教师提供的班级码 / Enter the class code provided by teacher"
                  required
                />
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={joining}
                >
                  {joining ? '加入中...' : '加入'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowJoinModal(false);
                    setClassCode('');
                    setError('');
                  }}
                  disabled={joining}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
