# 🚀 Online Exam Portal - Complete Setup & Run Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (Community Edition or Atlas Cloud)
- **Git** (optional)

### Check Installation
```bash
node --version      # Should show v14.0.0 or higher
npm --version       # Should show npm version
mongod --version    # Should show MongoDB version
```

---

## 📋 Step 1: Clone & Navigate to Project

```bash
# Clone the repository
git clone https://github.com/dhanushatiketi/online-exam-portal.git

# Navigate to project
cd online-exam-portal
```

---

## 🗄️ Step 2: Setup MongoDB

### Option A: Local MongoDB Installation

**On Windows:**
```bash
# MongoDB should be running as a service
# Check Services -> MongoDB Community Server
```

**On macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect to MongoDB shell - type 'exit' to close
```

### Option B: Use Docker (Recommended)

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb-exam mongo:latest

# Verify it's running
docker ps
```

### Option C: MongoDB Atlas Cloud (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env` file in backend:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/examDB
   ```

---

## 🛠️ Step 3: Backend Setup

### Navigate to Backend
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment

The `.env` file is already created. Verify it contains:
```
MONGODB_URI=mongodb://localhost:27017/examDB
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5001
NODE_ENV=development
```

**Update if using MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/examDB
```

### Seed Database with Sample Questions

```bash
node seed.js
```

Expected output:
```
Connected to MongoDB at mongodb://localhost:27017/examDB
✓ Cleared existing questions.
✓ Sample questions inserted successfully.
Disconnected from MongoDB.
```

### Start Backend Server

```bash
npm run dev
```

Expected output:
```
✓ MongoDB Connected
Server running on port 5001
```

**Backend is now running at:** `http://localhost:5001`

Test it:
```bash
curl http://localhost:5001
# Should return: {"message":"Online Examination System Backend Running","status":"healthy","timestamp":"..."}
```

---

## ⚛️ Step 4: Frontend Setup

### Open New Terminal/Command Prompt

### Navigate to Frontend
```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment

The `.env` file is already created. Verify it contains:
```
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=ExamCloud
VITE_APP_VERSION=1.0.0
```

### Start Frontend Server

```bash
npm run dev
```

Expected output:
```
VITE v5.2.0  running at:

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Frontend is now running at:** `http://localhost:5173`

---

## ✅ Step 5: Verify Everything Works

### 1. Open Browser

Navigate to: **`http://localhost:5173`**

You should see the ExamCloud homepage.

### 2. Test Registration

1. Click **"Register"** button
2. Fill in the form:
   - Name: `Test Student`
   - Email: `test@example.com`
   - Roll Number: `2024001`
   - Password: `password123`
3. Click **Submit**

Expected: Success message "User registered successfully"

### 3. Test Login

1. Click **"Login"** button
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **Submit**

Expected: Redirect to Dashboard

### 4. Test Taking Exam

1. From Dashboard, click on an exam (e.g., "JavaScript Basics")
2. Answer the questions
3. Click **Submit Exam**

Expected: Score displayed with results

### 5. View Results

1. Click **"View Results"** or navigate to Results page
2. See exam score and detailed answers

---

## 🧪 Testing API Endpoints

Use **Postman** or **curl** to test API:

### 1. Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "rollno": "2024001"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response will include:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "rollno": "2024001"
  }
}
```

### 3. Get Questions (Use token from login)
```bash
curl -X GET http://localhost:5001/api/questions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Submit Exam
```bash
curl -X POST http://localhost:5001/api/submitExam \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "answers": [
      {
        "questionId": "QUESTION_ID",
        "selectedOption": "Correct Answer"
      }
    ],
    "examName": "JavaScript Basics"
  }'
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:**
```
✗ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Try restarting MongoDB service

```bash
# Start MongoDB
mongod
# Or with Docker
docker start mongodb-exam
```

---

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution:**

**Find process using port:**
```bash
# Windows
netstat -ano | findstr :5001

# Mac/Linux
lsof -i :5001
```

**Kill process:**
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

**Or change port in backend/.env:**
```
PORT=5002
```

---

### CORS Errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Backend already has CORS enabled (check `backend/app.js`)
- Ensure frontend `.env` has correct API URL
- Restart both servers

---

### JWT Token Errors

**Error:**
```
Token is not valid
```

**Solution:**
- Clear browser localStorage
- Login again to get fresh token
- Check JWT_SECRET in backend `.env`

---

### Frontend Can't Connect to Backend

**Error:**
```
Failed to fetch
```

**Solution:**
- Ensure backend is running on port 5001
- Check `frontend/.env` has correct API URL
- Verify firewall isn't blocking the port
- Check browser console for detailed error

---

## 📁 Project Structure Overview

```
online-exam-portal/
├── backend/
│   ├── config/
│   │   └── database.js          # DB config
│   ├── controllers/             # Business logic
│   │   ├── authcontroller.js
│   │   ├── examcontroller.js
│   │   └── resultcontroller.js
│   ├── middleware/              # Auth & error handling
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── services/                # Service layer
│   ├── app.js                   # Express config
│   ├── server.js                # Entry point
│   ├── seed.js                  # Sample data
│   ├── package.json
│   └── .env                     # Environment vars
│
├── frontend/
│   ├── src/
│   │   ├── context/             # State management
│   │   │   ├── AuthContext.jsx
│   │   │   └── ExamContext.jsx
│   │   ├── pages/               # Page components
│   │   ├── services/            # API calls
│   │   ├── App.jsx              # Main app
│   │   └── index.jsx
│   ├── package.json
│   ├── .env
│   └── vite.config.js
│
├── README.md
└── SETUP_GUIDE.md
```

---

## 🚀 Quick Command Reference

### Terminal 1 - Backend
```bash
cd backend
npm install
node seed.js
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Browser
```
http://localhost:5173
```

---

## 📝 Available Exams (Pre-seeded)

1. **General Knowledge** (3 questions)
   - Capital of France
   - Red Planet
   - Largest Ocean

2. **JavaScript Basics** (3 questions)
   - Company that developed JavaScript
   - Single-line comments
   - HTML element for JavaScript

3. **Python Basics** (2 questions)
   - File extension
   - Variable creation

4. **HTML & CSS** (2 questions)
   - HTML full form
   - Line break element

---

## 🔐 Default Credentials

After seeding, you can test with any registered user:
- **Email:** test@example.com
- **Password:** password123

(You can create new users via registration)

---

## 📊 Database Structure

### Users Collection
```json
{
  "_id": ObjectId,
  "rollno": "2024001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "student"
}
```

### Questions Collection
```json
{
  "_id": ObjectId,
  "examName": "JavaScript Basics",
  "questionText": "Which company developed JavaScript?",
  "options": ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"],
  "correctAnswer": "Netscape"
}
```

### Results Collection
```json
{
  "_id": ObjectId,
  "rollno": "2024001",
  "studentName": "John Doe",
  "email": "john@example.com",
  "exam": "JavaScript Basics",
  "score": 3,
  "totalQuestions": 3,
  "answers": [...],
  "submittedAt": ISODate
}
```

---

## ✨ Next Steps

After successful setup:

1. **Test all features** - Register, login, take exams
2. **Explore code** - Understand the architecture
3. **Add more questions** - Modify `backend/seed.js`
4. **Deploy** - Use AWS/Heroku/DigitalOcean
5. **Customize** - Add admin panel, multiple attempts, etc.

---

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review console logs (browser & terminal)
3. Create issue on GitHub
4. Refer to main README.md

---

**Happy Testing! 🎉**
