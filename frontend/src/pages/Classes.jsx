import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classAPI } from '../services/api';

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getMyClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中... / Loading...</div>;
  }

  return (
    <div className="container">
      <div className="flex-between mb-3">
        <h1>{user.role === 'teacher' ? '我管理的班级' : '我的班级'} / My Classes</h1>
        {user.role === 'teacher' && (
          <Link to="/create-class" className="btn btn-success">
            + 创建班级 / Create Class
          </Link>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted">
            {user.role === 'teacher' 
              ? '您还没有创建任何班级 / You haven\'t created any classes yet'
              : '您还没有加入任何班级 / You haven\'t joined any classes yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {classes.map(cls => (
            <div key={cls.id} className="card">
              <h3>{cls.name}</h3>
              {cls.description && <p>{cls.description}</p>}
              {cls.teacher && (
                <p className="text-muted">
                  教师 / Teacher: {cls.teacher.name}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Link to={`/class/${cls.id}`} className="btn btn-primary">
                  查看详情 / View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
