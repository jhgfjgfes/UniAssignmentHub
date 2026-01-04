import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { materialAPI, classAPI } from '../services/api';

const Materials = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [classData, setClassData] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    file: null
  });

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, materialsRes] = await Promise.all([
        classAPI.getOne(classId),
        materialAPI.getAll(classId)
      ]);
      setClassData(classRes.data);
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('加载数据失败 / Failed to load data');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert('文件大小不能超过100MB / File size cannot exceed 100MB');
        return;
      }
      setUploadForm({
        ...uploadForm,
        file: file
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.title.trim()) {
      alert('请输入资料标题 / Please enter material title');
      return;
    }
    if (!uploadForm.file) {
      alert('请选择文件 / Please select a file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('classId', classId);
      formData.append('title', uploadForm.title);
      formData.append('file', uploadForm.file);

      await materialAPI.upload(formData);
      alert('上传成功！/ Uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({ title: '', file: null });
      loadData();
    } catch (error) {
      console.error('Failed to upload:', error);
      alert('上传失败，请重试 / Failed to upload, please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (material) => {
    try {
      const response = await materialAPI.download(material.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
      alert('下载失败，请重试 / Failed to download, please try again');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除此资料吗？/ Are you sure you want to delete this material?')) return;

    try {
      setDeleting(id);
      await materialAPI.delete(id);
      alert('删除成功！/ Deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('删除失败，请重试 / Failed to delete, please try again');
    } finally {
      setDeleting(null);
    }
  };

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
      xls: '📈',
      xlsx: '📈',
      txt: '📃',
      zip: '📦',
      rar: '📦',
      mp4: '🎬',
      mp3: '🎵',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️'
    };
    return icons[fileType?.toLowerCase()] || '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="container"><div className="loading">加载中... / Loading...</div></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(`/class/${classId}`)}>
          ← 返回班级 / Back to Class
        </button>
        <div className="header-actions">
          {classData && (
            <h2 style={{ margin: 0 }}>
              {classData.name}
            </h2>
          )}
          {isTeacher && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              上传资料 / Upload Material
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          教学资料 / Teaching Materials ({materials.length})
        </div>
        {materials.length === 0 ? (
          <div className="empty-state">
            <h3>暂无教学资料 / No Teaching Materials</h3>
            <p>该班级还没有上传任何教学资料 / No teaching materials have been uploaded to this class yet</p>
            {isTeacher && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowUploadModal(true)}
              >
                上传第一个资料 / Upload First Material
              </button>
            )}
          </div>
        ) : (
          <div className="materials-grid">
            {materials.map(material => (
              <div key={material.id} className="card material-card">
                <div className="material-icon">
                  {getFileIcon(material.fileType)}
                </div>
                <div className="material-info">
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{material.title}</h4>
                  <p className="text-muted" style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                    {material.fileName}
                  </p>
                  <div className="material-meta">
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {new Date(material.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    {material.uploader && (
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {material.uploader.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="material-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleDownload(material)}
                  >
                    下载
                  </button>
                  {isTeacher && (
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(material.id)}
                      disabled={deleting === material.id}
                    >
                      {deleting === material.id ? '删除中...' : '删除'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>上传教学资料 / Upload Teaching Material</h2>
              <button className="modal-close" onClick={() => {
                setShowUploadModal(false);
                setUploadForm({ title: '', file: null });
              }}>×</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="required">资料标题 / Material Title *</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="例如：第一章讲义 / Example: Chapter 1 Lecture Notes"
                  required
                />
              </div>

              <div className="form-group">
                <label className="required">选择文件 / Select File *</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                  {uploadForm.file && (
                    <div className="selected-file">
                      <strong>已选择 / Selected:</strong> {uploadForm.file.name}
                      <span className="text-muted">
                        ({formatFileSize(uploadForm.file.size)})
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-muted" style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                  支持的文件类型：PDF, Word, PowerPoint, Excel, 图片, 视频, 音频, ZIP等
                  <br />
                  最大文件大小：100MB / Max file size: 100MB
                </p>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? '上传中...' : '上传'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadForm({ title: '', file: null });
                  }}
                  disabled={uploading}
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

export default Materials;
