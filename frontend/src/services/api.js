import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Course API
export const courseAPI = {
  getAll: () => api.get('/courses/all'),
  getMyCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId) => api.post('/courses/enroll', { courseId }),
  unenroll: (courseId) => api.delete(`/courses/${courseId}/enroll`)
};

// Assignment API
export const assignmentAPI = {
  getAll: (courseId) => api.get(`/assignments?courseId=${courseId}`),
  getUnsubmitted: () => api.get('/assignments/unsubmitted'),
  getOne: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`)
};

// Submission API
export const submissionAPI = {
  submit: (formData) => api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMy: () => api.get('/submissions'),
  getByAssignment: (assignmentId) => api.get(`/submissions?assignmentId=${assignmentId}`),
  grade: (id, data) => api.put(`/submissions/${id}/grade`, data),
  download: (id) => api.get(`/submissions/${id}/download`, { responseType: 'blob' })
};

// Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications?unreadOnly=true'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  sendAnnouncement: (data) => api.post('/notifications/announcement', data)
};

// Class API
export const classAPI = {
  getAll: () => api.get('/classes/all'),
  getMyClasses: () => api.get('/classes'),
  getOne: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  join: (classId) => api.post('/classes/join', { classId }),
  leave: (classId) => api.delete(`/classes/${classId}/leave`),
  getMembers: (id) => api.get(`/classes/${id}/members`),
  addStudent: (id, studentId) => api.post(`/classes/${id}/students`, { studentId }),
  removeStudent: (id, studentId) => api.delete(`/classes/${id}/students/${studentId}`)
};

// Material API
export const materialAPI = {
  getAll: (classId) => api.get(`/materials?classId=${classId}`),
  upload: (formData) => api.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  download: (id) => api.get(`/materials/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/materials/${id}`)
};

export default api;
