import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classAPI, materialAPI } from '../services/api';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [members, setMembers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newStudentInput, setNewStudentInput] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadClassData();
  }, [id]);

  const loadClassData = async () => {
    try {
      // Load class details first
      try {
        const classRes = await classAPI.getOne(id);
        setClassData(classRes.data);
      } catch (err) {
        console.error('Failed to load class details:', err);
        // If class details fail, we can't do much
        return; 
      }

      // Load members
      try {
        const membersRes = await classAPI.getMembers(id);
        setMembers(membersRes.data);
      } catch (err) {
        console.error('Failed to load members:', err);
      }

      // Load materials
      try {
        const materialsRes = await materialAPI.getAll(id);
        setMaterials(materialsRes.data);
      } catch (err) {
        console.error('Failed to load materials:', err);
      }

    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', id);
    formData.append('title', file.name);
    formData.append('type', 'document'); // Default type

    setUploading(true);
    try {
      await materialAPI.upload(formData);
      // Refresh materials
      const res = await materialAPI.getAll(id);
      setMaterials(res.data);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (materialId, filename) => {
    try {
      const response = await materialAPI.download(materialId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      await classAPI.removeStudent(id, studentId);
      setMembers(members.filter(m => m.id !== studentId));
    } catch (error) {
      console.error('Failed to remove student:', error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentInput) return;

    setAddingStudent(true);
    try {
      const isEmail = newStudentInput.includes('@');
      const data = isEmail ? { email: newStudentInput } : { username: newStudentInput };

      await classAPI.addStudent(id, data);
      setNewStudentInput('');
      // Refresh members
      const membersRes = await classAPI.getMembers(id);
      setMembers(membersRes.data);
      alert('Student added successfully');
    } catch (error) {
      console.error('Failed to add student:', error);
      alert(error.response?.data?.error || 'Failed to add student');
    } finally {
      setAddingStudent(false);
    }
  };

  const handleImportStudents = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setImporting(true);
    try {
      const res = await classAPI.importStudents(id, formData);
      const { success, failed, errors } = res.data.results;
      
      let msg = `Import completed.\nSuccess: ${success}\nFailed: ${failed}`;
      if (failed > 0) {
        msg += '\n\nErrors:\n' + errors.map(e => 
          `${e.username || 'Unknown'}: ${e.error}`
        ).join('\n');
      }
      alert(msg);

      // Refresh members
      const membersRes = await classAPI.getMembers(id);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  if (loading) return <div className="loading">加载中... / Loading...</div>;
  if (!classData) return <div className="container">Class not found</div>;

  return (
    <div className="container">
      <div className="card mb-3">
        <h2>{classData.name}</h2>
        <p>{classData.description}</p>
        <p className="text-muted">Teacher: {classData.teacher?.name}</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>教学资料 / Materials</h3>
          {user.role === 'teacher' && (
            <div className="mb-3">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="form-control"
              />
              {uploading && <small>Uploading...</small>}
            </div>
          )}
          <ul className="list-group">
            {materials.map(material => (
              <li key={material.id} className="list-group-item flex-between">
                <span>{material.title}</span>
                <button
                  onClick={() => handleDownload(material.id, material.title)}
                  className="btn btn-sm btn-primary"
                >
                  下载 / Download
                </button>
              </li>
            ))}
            {materials.length === 0 && <p className="text-muted">暂无资料 / No materials</p>}
          </ul>
        </div>

        <div className="card">
          <h3>班级成员 / Members ({members.length})</h3>
          
          {user.role === 'teacher' && (
            <div className="mb-3">
              <form onSubmit={handleAddStudent} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="输入学生邮箱或学号 / Enter email or student ID"
                  value={newStudentInput}
                  onChange={(e) => setNewStudentInput(e.target.value)}
                  className="form-control"
                  required
                />
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={addingStudent}
                >
                  {addingStudent ? '添加中...' : '添加 / Add'}
                </button>
              </form>
              
              <div className="flex gap-2 align-center">
                <label className="btn btn-outline-primary" style={{cursor: 'pointer'}}>
                  {importing ? '导入中... / Importing...' : '批量导入 (Excel) / Import Excel'}
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImportStudents}
                    style={{display: 'none'}}
                    disabled={importing}
                  />
                </label>
                <small className="text-muted">
                  支持 .xlsx, .xls (需包含"学号"和"姓名"列)
                </small>
              </div>
            </div>
          )}

          <ul className="list-group">
            {members.map(member => (
              <li key={member.id} className="list-group-item flex-between">
                <span>{member.name} ({member.email})</span>
                {user.role === 'teacher' && (
                  <button
                    onClick={() => handleRemoveStudent(member.id)}
                    className="btn btn-sm btn-danger"
                  >
                    移除 / Remove
                  </button>
                )}
              </li>
            ))}
            {members.length === 0 && <p className="text-muted">暂无成员 / No members</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
