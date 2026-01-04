import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classAPI } from '../services/api';

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [classData, setClassData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    loadClass();
  }, [id]);

  const loadClass = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getOne(id);
      setClassData(response.data);
    } catch (error) {
      console.error('Failed to load class:', error);
      alert('加载班级失败 / Failed to load class');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await classAPI.getMembers(id);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleLeaveClass = async () => {
    if (!window.confirm('确定要退出此班级吗？/ Are you sure you want to leave this class?')) return;

    try {
      setLeaving(true);
      await classAPI.leave(id);
      alert('退出班级成功！/ Left class successfully!');
      navigate('/classes');
    } catch (error) {
      console.error('Failed to leave class:', error);
      alert('退出失败，请重试 / Failed to leave, please try again');
    } finally {
      setLeaving(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!window.confirm('确定要删除此班级吗？/ Are you sure you want to delete this class?')) return;

    try {
      await classAPI.delete(id);
      alert('班级删除成功！/ Class deleted successfully!');
      navigate('/classes');
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('删除失败，请重试 / Failed to delete, please try again');
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  if (!classData) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <h3>班级不存在 / Class Not Found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/classes')}>
              返回班级列表 / Back to Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/classes')}>
          ← 返回 / Back
        </button>
        <div className="header-actions">
          <button 
            className="btn btn-info"
            onClick={() => navigate(`/class/${id}/materials`)}
          >
            教学资料 / Teaching Materials
          </button>
          {isTeacher && (
            <button 
              className="btn btn-danger"
              onClick={handleDeleteClass}
            >
              删除班级
            </button>
          )}
          {!isTeacher && (
            <button 
              className="btn btn-warning"
              onClick={handleLeaveClass}
              disabled={leaving}
            >
              {leaving ? '退出中...' : '退出班级'}
            </button>
          )}
        </div>
      </div>

      <div className="class-detail">
        <div className="card">
          <div className="card-header">
            <h1>{classData.name}</h1>
            <span className="badge badge-info">
              班级码 / Code: {classData.code}
            </span>
          </div>
          <div className="card-body">
            {classData.description && (
              <div className="description">
                <h3>班级描述 / Class Description</h3>
                <p>{classData.description}</p>
              </div>
            )}
            
            {classData.course && (
              <div className="course-info">
                <h3>关联课程 / Related Course</h3>
                <p>
                  <strong>{classData.course.code} - {classData.course.name}</strong>
                </p>
                {classData.course.description && (
                  <p className="text-muted">{classData.course.description}</p>
                )}
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/course/${classData.course.id}`)}
                >
                  查看课程详情 / View Course Details
                </button>
              </div>
            )}

            {classData.teacher && (
              <div className="teacher-info">
                <h3>班主任 / Class Teacher</h3>
                <p>{classData.teacher.name}</p>
              </div>
            )}

            <div className="class-stats">
              <div className="stat-item">
                <strong>{members.length}</strong>
                <span>班级成员 / Members</span>
              </div>
              <div className="stat-item">
                <strong>
                  {new Date(classData.createdAt).toLocaleDateString('zh-CN')}
                </strong>
                <span>创建日期 / Created</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            班级成员 / Class Members ({members.length})
            {loadingMembers && <span className="loading-indicator"> 加载中...</span>}
            {!loadingMembers && members.length === 0 && !isTeacher && (
              <button className="btn btn-sm btn-primary" onClick={loadMembers}>
                查看成员
              </button>
            )}
            {!loadingMembers && members.length > 0 && (
              <button className="btn btn-sm btn-secondary" onClick={() => setMembers([])}>
                隐藏成员
              </button>
            )}
          </div>
          {members.length === 0 && !loadingMembers ? (
            <div className="empty-state">
              <p>点击"查看成员"按钮查看班级成员 / Click "View Members" to see class members</p>
            </div>
          ) : (
            <div className="list-group">
              {members.map(member => (
                <div key={member.id} className="list-item">
                  <div className="flex-between">
                    <div>
                      <strong>{member.student?.name}</strong>
                      <p className="text-muted" style={{ margin: '0.25rem 0 0 0' }}>
                        {member.student?.email}
                      </p>
                      <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                        加入时间: {new Date(member.joinedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    {member.student?.id === user?.id && (
                      <span className="badge badge-success">你 / You</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
