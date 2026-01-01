#!/bin/bash

# Demo data creation script for UniAssignmentHub
# 演示数据创建脚本

API_URL="http://localhost:3001/api"

echo "==================================="
echo "Creating demo data for UniAssignmentHub"
echo "为 UniAssignmentHub 创建演示数据"
echo "==================================="
echo ""

# Create teacher account
echo "📝 Creating teacher account..."
TEACHER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"demo_teacher",
    "email":"teacher@demo.com",
    "password":"teacher123",
    "role":"teacher",
    "name":"张老师 (Teacher Zhang)"
  }')

TEACHER_TOKEN=$(echo $TEACHER_RESPONSE | jq -r .token)
echo "✅ Teacher account created: demo_teacher / teacher123"
echo ""

# Create student accounts
echo "📝 Creating student accounts..."
STUDENT1_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"demo_student1",
    "email":"student1@demo.com",
    "password":"student123",
    "role":"student",
    "name":"李明 (Li Ming)"
  }')

STUDENT1_TOKEN=$(echo $STUDENT1_RESPONSE | jq -r .token)

STUDENT2_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"demo_student2",
    "email":"student2@demo.com",
    "password":"student123",
    "role":"student",
    "name":"王芳 (Wang Fang)"
  }')

STUDENT2_TOKEN=$(echo $STUDENT2_RESPONSE | jq -r .token)

echo "✅ Student accounts created:"
echo "   - demo_student1 / student123 (李明)"
echo "   - demo_student2 / student123 (王芳)"
echo ""

# Create courses
echo "📚 Creating courses..."
COURSE1=$(curl -s -X POST $API_URL/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "name":"计算机科学导论 (Introduction to Computer Science)",
    "code":"CS101",
    "description":"Learn the fundamentals of computer science"
  }')

COURSE1_ID=$(echo $COURSE1 | jq -r .id)

COURSE2=$(curl -s -X POST $API_URL/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "name":"数据结构与算法 (Data Structures and Algorithms)",
    "code":"CS201",
    "description":"Learn about data structures and algorithms"
  }')

COURSE2_ID=$(echo $COURSE2 | jq -r .id)

echo "✅ Courses created:"
echo "   - CS101: 计算机科学导论"
echo "   - CS201: 数据结构与算法"
echo ""

# Create class
echo "🏫 Creating class..."
CLASS1=$(curl -s -X POST $API_URL/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "name":"计算机2024级1班 (CS Class 2024-1)",
    "description":"Computer Science Class of 2024"
  }')

CLASS1_ID=$(echo $CLASS1 | jq -r .id)
echo "✅ Class created: 计算机2024级1班"
echo ""

# Enroll students
echo "👥 Enrolling students in courses..."
curl -s -X POST $API_URL/courses/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT1_TOKEN" \
  -d "{\"courseId\":$COURSE1_ID}" > /dev/null

curl -s -X POST $API_URL/courses/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT1_TOKEN" \
  -d "{\"courseId\":$COURSE2_ID}" > /dev/null

curl -s -X POST $API_URL/courses/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT2_TOKEN" \
  -d "{\"courseId\":$COURSE1_ID}" > /dev/null

echo "✅ Students enrolled in courses"
echo ""

# Create assignments
echo "📋 Creating assignments..."
ASSIGNMENT1=$(curl -s -X POST $API_URL/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"title\":\"作业1: Hello World程序 (Assignment 1: Hello World Program)\",
    \"description\":\"编写你的第一个程序 / Write your first program\",
    \"courseId\":$COURSE1_ID,
    \"dueDate\":\"2025-12-31T23:59:59Z\",
    \"maxScore\":100
  }")

ASSIGNMENT2=$(curl -s -X POST $API_URL/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"title\":\"作业2: 数据类型练习 (Assignment 2: Data Types Practice)\",
    \"description\":\"练习各种数据类型 / Practice different data types\",
    \"courseId\":$COURSE1_ID,
    \"dueDate\":\"2026-01-15T23:59:59Z\",
    \"maxScore\":100
  }")

ASSIGNMENT3=$(curl -s -X POST $API_URL/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"title\":\"作业3: 排序算法实现 (Assignment 3: Sorting Algorithms)\",
    \"description\":\"实现快速排序和归并排序 / Implement quick sort and merge sort\",
    \"courseId\":$COURSE2_ID,
    \"dueDate\":\"2026-01-20T23:59:59Z\",
    \"maxScore\":150
  }")

echo "✅ Assignments created - Students will receive notifications!"
echo ""

echo "==================================="
echo "✅ Demo data created successfully!"
echo "✅ 演示数据创建成功！"
echo "==================================="
echo ""
echo "Login credentials / 登录凭据:"
echo ""
echo "Teacher / 教师:"
echo "  Username: demo_teacher"
echo "  Password: teacher123"
echo ""
echo "Students / 学生:"
echo "  Username: demo_student1"
echo "  Password: student123"
echo ""
echo "  Username: demo_student2"
echo "  Password: student123"
echo ""
echo "🌐 Open http://localhost:3000 and login!"
echo "🌐 打开 http://localhost:3000 并登录！"
echo ""
