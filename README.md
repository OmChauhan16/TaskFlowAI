# TaskFlow AI 🚀

A production-ready, AI-powered project management platform built with the MERN stack. Features real-time collaboration, Kanban boards with live drag-and-drop sync, AI-powered task suggestions, team analytics, and fully automated deployment on Render.

![TaskFlow AI](https://img.shields.io/badge/Status-Live-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Render](https://img.shields.io/badge/Render-Frontend%20%7C%20Backend-46E3B7)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌐 Live Demo

- **Frontend:** [https://taskflowai.onrender.com](https://taskflowai.onrender.com)

---


---

## ✨ Features

### 🤖 AI-Powered
- **Smart task suggestions** using Groq API
- **Auto priority recommendations** based on task context
- **AI-generated task descriptions** to save time
- **Natural language task parsing** — type "Fix login bug by Friday high priority" and AI creates the task

### 📋 Task Management
- **Kanban board** with drag-and-drop across columns (To Do → In Progress → Review → Done)
- **Real-time collaboration** — changes sync instantly for all team members via Socket.io
- **Task detail view** with descriptions, assignees, due dates, labels, and progress tracking
- **Filters** by status, priority, assignee, and labels
- **File attachments** via Cloudinary

### 📊 Analytics & Dashboard
- **Team workload balancing** — see who is overloaded
- **Task completion rates** over time
- **Priority breakdown** charts
- **MongoDB aggregation pipelines** powering all analytics

### 🔔 Notifications
- **Real-time in-app notifications** via Socket.io
- **Email notifications** via BullMQ job queues (async, non-blocking)
- **Daily digest** emails for task summaries

### 🔒 Security
- **JWT authentication** with refresh tokens
- **Firebase Authentication** for OAuth (Google login)
- **Rate limiting** with Redis — prevents API abuse
- **Helmet.js** for HTTP security headers
- **Input validation** and sanitization on all endpoints

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Socket.io Client | Real-time updates |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| Socket.io | WebSocket real-time events |
| Redis | Caching + rate limiting + sessions |
| JWT | Authentication tokens |
| Firebase Admin | OAuth verification |
| Cloudinary | File/image storage |
| Multer | File upload middleware |
| Helmet + CORS | Security |
| Morgan | HTTP request logging |
| Groq SDK | AI API (LLaMA 3 model) |

### Infrastructure & DevOps
| Technology | Purpose |
|-----------|---------|
| Render | Frontend hosting (Static Site) |
| Render | Backend hosting (Web Service) |
| GitHub Actions | Auto-deploy triggered on push to master |
| MongoDB Atlas | Cloud database |
| Cloudinary | Media storage CDN |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React)                       │
│          Render — Static Site Hosting                    │
│     React Router • Tailwind • Socket.io Client          │
└─────────────────┬───────────────────┬───────────────────┘
                  │ HTTP (REST API)    │ WebSocket
                  ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER (Node.js)                        │
│           Render — Web Service (Auto Deploy)             │
│   Express REST API    │    Socket.io Server              │
│   JWT + Firebase Auth │    Project Rooms                 │
│   Rate Limiting       │    Real-time Events              │
└────────┬─────────────┬──────────────┬────────────────────┘
         │             │              │
         ▼             ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ MongoDB  │  │  Redis   │  │  BullMQ  │
   │  Atlas   │  │  Cache   │  │  Queues  │
   └──────────┘  └──────────┘  └──────────┘
         │
         ▼
   ┌──────────┐   ┌──────────┐
   │Cloudinary│   │  Groq    │
   │  Media   │   │  API     │
   └──────────┘   └──────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Redis
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/OmChauhan16/TaskFlowAI.git
cd TaskFlowAI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Groq
GROQ_API_KEY=your_groq_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Firebase
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your-app.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your-app.appspot.com
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_measurementId=G-XXXXXXXXXX
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📁 Project Structure

```
TaskFlowAI/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── redis.js            # Redis connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── task.controller.js  # Socket.io emit on CRUD
│   │   ├── project.controller.js
│   │   ├── user.controller.js
│   │   ├── dashboard.controller.js
│   │   └── ai.controller.js    # Groq integration
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   ├── error.middleware.js
│   │   └── rateLimiter.js      # Redis rate limiting
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   ├── project.routes.js
│   │   ├── user.routes.js
│   │   ├── dashboard.routes.js
│   │   └── ai.routes.js
│   ├── socket/
│   │   └── socketHandler.js    # Socket.io event handlers
│   └── server.js               # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── tasks/
    │   │   │   ├── CreateTaskModal.jsx
    │   │   │   └── TaskDetailModal.jsx
    │   │   └── ...
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── TaskContext.jsx  # Global task state
    │   │   └── SocketContext.jsx # Socket connection
    │   ├── pages/
    │   │   ├── Kanban.jsx       # Real-time Kanban board
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── SettingsPage.jsx
    │   ├── services/
    │   │   ├── taskService.js
    │   │   ├── authService.js
    │   │   └── socket.js        # Socket.io client
    │   └── main.jsx
    └── index.html
```

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login with email/password
POST   /api/auth/firebase       Login with Firebase (Google)
GET    /api/auth/me             Get current user
POST   /api/auth/logout         Logout
```

### Tasks
```
GET    /api/tasks               Get all tasks (with filters)
POST   /api/tasks               Create task
GET    /api/tasks/:id           Get single task
PUT    /api/tasks/:id           Update task
PATCH  /api/tasks/:id/status    Update task status (Kanban drag)
DELETE /api/tasks/:id           Delete task
```

### Projects
```
GET    /api/projects            Get all projects
POST   /api/projects            Create project
GET    /api/projects/:id        Get single project
PUT    /api/projects/:id        Update project
DELETE /api/projects/:id        Delete project
```

### Dashboard & AI
```
GET    /api/dashboard           Get analytics data
POST   /api/ai/suggest          Get AI task suggestions
POST   /api/ai/priority         Get AI priority recommendation
```

---

## ⚡ Real-Time Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-project` | Client → Server | Join project's socket room |
| `leave-project` | Client → Server | Leave project room |
| `task-created` | Server → Client | New task added by another user |
| `task-updated` | Server → Client | Task edited or moved columns |
| `task-deleted` | Server → Client | Task removed by another user |
| `task-dragging` | Client → Server | Show live drag indicator to others |
| `task-drag-end` | Client → Server | Clear drag indicator |
| `notification` | Server → Client | Personal notification to user |

---

## 🚢 Deployment

Both frontend and backend are deployed on **Render** with automatic deploys on every push to `master`.

### Backend → Render Web Service

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo → select `TaskFlowAI`
3. Configure:
```
Name:            taskflowai-backend
Root Directory:  backend
Build Command:   npm install
Start Command:   node server.js
```
4. Add all environment variables under the **Environment** tab
5. Click **Deploy** — live at `https://taskflowai-backend.onrender.com`

### Frontend → Render Static Site

1. Go to [render.com](https://render.com) → New → **Static Site**
2. Connect your GitHub repo → select `TaskFlowAI`
3. Configure:
```
Name:            taskflowai-frontend
Root Directory:  frontend
Build Command:   npm install && npm run build
Publish Directory: dist
```
4. Add environment variables under the **Environment** tab:
```
VITE_API_URL      = https://taskflowai-backend.onrender.com
VITE_SOCKET_URL   = https://taskflowai-backend.onrender.com
VITE_apiKey       = your_firebase_api_key
VITE_authDomain   = your-app.firebaseapp.com
VITE_projectId    = your_project_id
VITE_storageBucket = your-app.appspot.com
VITE_messagingSenderId = your_sender_id
VITE_appId        = your_app_id
VITE_measurementId = G-XXXXXXXXXX
```
5. Click **Deploy** — live at `https://taskflowai.onrender.com`

> ⚠️ **React Router fix on Render Static Site:** Go to Redirects/Rewrites → Add rule:
> Source: `/*` → Destination: `/index.html` → Action: `Rewrite`
> This ensures page refresh and direct URL visits work correctly.

### Auto Deploy

Both services auto-deploy on every push to `master` — no manual steps needed.

---

## 🔧 Environment Variables Reference

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `REDIS_URL` | Redis connection URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GROQ_API_KEY` | Groq API key |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | Socket.io server URL |
| `VITE_apiKey` | Firebase API key |
| `VITE_authDomain` | Firebase auth domain |
| `VITE_projectId` | Firebase project ID |

---

## 👤 Author

**Om Chauhan**

- GitHub: [@OmChauhan16](https://github.com/OmChauhan16)
- LinkedIn: [om-chauhan](https://www.linkedin.com/in/om-chauhan-a72b92213/)
- Email: omc5246@gmail.com

---
