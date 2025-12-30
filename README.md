# UniAssignmentHub

大学生作业管理平台 / University Assignment Management Platform

## 功能特性 / Features

### 学生功能 / Student Features
- ✅ 多种格式作业提交 (PDF, DOC/DOCX, MD, 视频, PPT, Excel) / Submit assignments in multiple formats
- ✅ 课程管理 / Manage enrolled courses  
- ✅ 作业按课程分类 / Assignments organized by course
- ✅ **新作业通知提醒（重要）** / **Notification system for new assignments (Important)**
- ✅ **显眼的未交作业提醒** / **Prominent reminder for unsubmitted assignments**
- ✅ 查看成绩和反馈 / View grades and feedback
- ✅ 加入班级 / Join classes
- ✅ 下载教学资料 / Download teaching materials

### 教师功能 / Teacher Features
- ✅ 审阅、批注、评分学生作业 / Review, annotate, and grade student assignments
- ✅ 创建和管理多个班级 / Create and manage multiple classes
- ✅ 创建和管理课程 / Create and manage courses
- ✅ 上传多种类型教学资料 / Upload various types of teaching materials
- ✅ 向学生发布通知 / Send notifications to students
- ✅ 发布作业 / Publish assignments

## 技术栈 / Tech Stack

### 后端 / Backend
- Node.js + Express
- Sequelize ORM
- SQLite Database
- JWT Authentication
- Multer (文件上传 / File uploads)

### 前端 / Frontend
- React 19
- React Router
- Axios
- Vite

## 安装和运行 / Installation and Running

### 前置要求 / Prerequisites
- Node.js 18+ 
- npm or yarn

### 后端设置 / Backend Setup

1. 进入后端目录 / Navigate to backend directory:
```bash
cd backend
```

2. 安装依赖 / Install dependencies:
```bash
npm install
```

3. 创建环境变量文件 / Create environment file:
```bash
cp .env.example .env
```

4. 启动后端服务器 / Start the backend server:
```bash
npm start
```

后端服务器将在 http://localhost:3001 运行
Backend server will run on http://localhost:3001

### 前端设置 / Frontend Setup

1. 进入前端目录 / Navigate to frontend directory:
```bash
cd frontend
```

2. 安装依赖 / Install dependencies:
```bash
npm install
```

3. 启动开发服务器 / Start the development server:
```bash
npm run dev
```

前端应用将在 http://localhost:3000 运行
Frontend application will run on http://localhost:3000

## 使用说明 / Usage

### 首次使用 / First Time Use

1. 访问 http://localhost:3000
2. 点击"注册"创建账号 / Click "Register" to create an account
3. 选择角色（学生或教师）/ Select role (Student or Teacher)
4. 填写注册信息 / Fill in registration information
5. 登录系统 / Login to the system

### 学生使用流程 / Student Workflow

1. **查看未提交作业提醒** - 登录后首页会显著提醒未提交的作业数量
   View unsubmitted assignments reminder - Dashboard shows prominent notification
2. **选课** - 浏览并选修课程
   Enroll - Browse and enroll in courses
3. **查看作业** - 在作业页面查看所有课程的作业
   View assignments - Check all course assignments
4. **提交作业** - 上传支持格式的文件（PDF, DOC, DOCX, MD, 视频, PPT, Excel）
   Submit assignments - Upload supported file formats
5. **查看成绩** - 教师批改后可查看成绩和反馈
   View grades - Check grades and feedback after teacher reviews
6. **接收通知** - 新作业发布时会收到通知提醒
   Receive notifications - Get notified when new assignments are published

### 教师使用流程 / Teacher Workflow

1. **创建课程** - 创建并管理自己教授的课程
   Create courses - Create and manage your courses
2. **创建班级** - 创建班级并添加学生
   Create classes - Create classes and add students
3. **发布作业** - 为课程发布作业，学生会自动收到通知
   Publish assignments - Create assignments, students get auto-notified
4. **批改作业** - 查看学生提交，打分并提供反馈
   Grade assignments - Review submissions, score and provide feedback
5. **上传资料** - 向班级上传教学资料
   Upload materials - Share teaching materials with classes
6. **发送通知** - 向学生发布课程通知
   Send notifications - Send announcements to students

## API 端点 / API Endpoints

### 认证 / Authentication
- `POST /api/auth/register` - 用户注册 / User registration
- `POST /api/auth/login` - 用户登录 / User login
- `GET /api/auth/profile` - 获取用户信息 / Get user profile

### 课程 / Courses
- `GET /api/courses` - 获取我的课程 / Get my courses
- `GET /api/courses/all` - 获取所有课程 / Get all courses
- `POST /api/courses` - 创建课程（教师）/ Create course (Teacher)
- `POST /api/courses/enroll` - 选课（学生）/ Enroll in course (Student)

### 作业 / Assignments
- `GET /api/assignments?courseId=:id` - 获取课程作业 / Get course assignments
- `GET /api/assignments/unsubmitted` - 获取未提交作业（学生）/ Get unsubmitted assignments (Student)
- `POST /api/assignments` - 创建作业（教师）/ Create assignment (Teacher)

### 提交 / Submissions
- `POST /api/submissions` - 提交作业（学生）/ Submit assignment (Student)
- `PUT /api/submissions/:id/grade` - 批改作业（教师）/ Grade submission (Teacher)
- `GET /api/submissions/:id/download` - 下载提交文件 / Download submission file

### 通知 / Notifications
- `GET /api/notifications` - 获取通知列表 / Get notifications
- `GET /api/notifications/unread-count` - 获取未读数量 / Get unread count
- `PUT /api/notifications/:id/read` - 标记为已读 / Mark as read

### 班级 / Classes
- `GET /api/classes` - 获取我的班级 / Get my classes
- `POST /api/classes` - 创建班级（教师）/ Create class (Teacher)
- `POST /api/classes/join` - 加入班级（学生）/ Join class (Student)

### 教学资料 / Materials
- `POST /api/materials` - 上传资料（教师）/ Upload material (Teacher)
- `GET /api/materials?classId=:id` - 获取班级资料 / Get class materials
- `GET /api/materials/:id/download` - 下载资料 / Download material

## 项目结构 / Project Structure

```
UniAssignmentHub/
├── backend/                 # 后端服务 / Backend service
│   ├── src/
│   │   ├── config/         # 配置文件 / Configuration
│   │   ├── models/         # 数据模型 / Data models
│   │   ├── controllers/    # 控制器 / Controllers
│   │   ├── routes/         # 路由 / Routes
│   │   ├── middleware/     # 中间件 / Middleware
│   │   └── server.js       # 服务器入口 / Server entry
│   ├── uploads/            # 文件上传目录 / Uploads directory
│   └── package.json
├── frontend/               # 前端应用 / Frontend application
│   ├── src/
│   │   ├── components/    # React组件 / React components
│   │   ├── pages/         # 页面组件 / Page components
│   │   ├── services/      # API服务 / API services
│   │   ├── context/       # React Context / React Context
│   │   ├── App.jsx        # 应用入口 / App entry
│   │   └── main.jsx       # 主入口 / Main entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 支持的文件类型 / Supported File Types

作业提交支持以下文件类型 / Assignment submissions support the following file types:
- PDF (`.pdf`)
- Word Documents (`.doc`, `.docx`)
- Markdown (`.md`)
- Videos (`.mp4`, `.avi`, `.mov`)
- PowerPoint (`.ppt`, `.pptx`)
- Excel (`.xls`, `.xlsx`)

## 开发计划 / Development Roadmap

- [x] 用户认证系统 / User authentication system
- [x] 课程管理 / Course management
- [x] 作业发布和提交 / Assignment publishing and submission
- [x] 通知系统 / Notification system
- [x] 未提交作业提醒 / Unsubmitted assignments reminder
- [x] 作业批改和评分 / Assignment grading
- [x] 班级管理 / Class management
- [x] 教学资料上传 / Teaching materials upload
- [ ] 实时通知（WebSocket）/ Real-time notifications (WebSocket)
- [ ] 作业在线批注 / Online assignment annotation
- [ ] 数据分析和报表 / Data analytics and reports
- [ ] 移动端适配 / Mobile responsiveness
- [ ] 多语言支持增强 / Enhanced multilingual support

## 许可证 / License

ISC

## 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！
Issues and Pull Requests are welcome!
