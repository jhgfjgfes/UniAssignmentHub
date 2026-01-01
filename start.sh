#!/bin/bash

# UniAssignmentHub Quick Start Script
# 快速启动脚本

echo "==================================="
echo "UniAssignmentHub - Starting Services"
echo "大学生作业管理平台 - 启动服务"
echo "==================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "❌ Node.js 未安装。请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend / 设置后端..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies / 安装后端依赖..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example / 从 .env.example 创建 .env 文件..."
    cp .env.example .env
fi

echo "✅ Backend setup complete / 后端设置完成"
echo ""

# Frontend setup
echo "📦 Setting up frontend / 设置前端..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies / 安装前端依赖..."
    npm install
fi

echo "✅ Frontend setup complete / 前端设置完成"
echo ""

# Start services
echo "🚀 Starting backend server on http://localhost:3001"
echo "🚀 在 http://localhost:3001 启动后端服务器"
cd ../backend
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

echo ""
echo "🚀 Starting frontend server on http://localhost:3000"
echo "🚀 在 http://localhost:3000 启动前端服务器"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==================================="
echo "✅ All services started successfully!"
echo "✅ 所有服务启动成功！"
echo "==================================="
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🌐 Backend API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop all services"
echo "按 Ctrl+C 停止所有服务"
echo ""

# Wait for user to stop
wait
