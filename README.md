# 🚀 Real-Time Collaborative Editor (Google Docs Clone)

A full-stack SaaS application that enables multiple users to collaborate on documents in real-time, similar to Google Docs.

---

## 🌍 Live Demo

👉 https://your-app.vercel.app
👉 https://your-backend.onrender.com

---

## 📂 GitHub Repository

👉 https://github.com/Harshpandeyiitian04/Realtime-editor

---

## 🧠 Overview

This project is a real-time collaborative document editor where users can:

* Create and manage multiple documents
* Edit documents simultaneously with other users
* See live updates instantly
* Share documents with role-based access
* Add comments and track changes

It demonstrates full-stack development, real-time systems, and scalable architecture.

---

## ✨ Features

### 🔐 Authentication

* User signup & login
* JWT-based authentication
* Protected API routes

---

### 📄 Document Management

* Create, edit, delete documents
* Multi-document dashboard
* Rename documents
* Auto-save with debouncing

---

### ⚡ Real-Time Collaboration

* Live editing using Socket.io
* Multiple users editing simultaneously
* Instant content synchronization

---

### 👥 User Presence & Roles

* Active users list (live)
* Role-based access (viewer / editor)
* Permission-based document access

---

### ✍️ Typing Indicator

* Shows which user is currently typing

---

### 🕒 Version History

* Tracks document edits
* Shows who edited and when
* Time-based display (e.g., "2 mins ago")

---

### 💬 Comments System

* Add comments to documents
* Persistent comment storage
* Displays user and message

---

### 🗑 Document Actions

* Delete document
* Save as copy

---

### 🎨 UI/UX

* Clean Google Docs–inspired layout
* Sidebar with users, history, comments
* Responsive and modern interface

---

## 🛠 Tech Stack

### Frontend

* React (TypeScript)
* Tailwind CSS
* Socket.io-client
* TipTap (Rich text editor)

---

### Backend

* Node.js
* Express.js
* Socket.io

---

### Database

* PostgreSQL

---

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon

---

## 🧱 System Architecture

Client (React)
⬇
Socket.io (Real-time communication)
⬇
Express Server (API layer)
⬇
PostgreSQL (Data storage)

---

## ⚙️ Installation (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/Harshpandeyiitian04/Realtime-editor.git
cd Realtime-editor
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
DATABASE_URL=postgres_url_from_me
JWT_SECRET=secret_key_you like
PORT=5000
```

Run server:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Auth

* POST /api/auth/signup
* POST /api/auth/login

---

### Documents

* GET /api/documents
* POST /api/documents
* GET /api/documents/:id
* PUT /api/documents/:id
* DELETE /api/documents/:id

---

### Sharing

* POST /api/documents/:id/share

---

### History

* GET /api/documents/:id/history

---

### Comments

* GET /api/documents/:id/comments
* POST /api/documents/:id/comment

---

## 🧠 Key Concepts Implemented

* WebSockets for real-time communication
* JWT authentication & authorization
* Role-based access control
* Debouncing for performance optimization
* Relational database design
* REST API architecture

---

## 🚀 Future Improvements

* Cursor position tracking (Google Docs style)
* Version rollback system
* Rich text formatting toolbar
* Notifications system
* Mobile responsiveness improvements

---

## 📸 Screenshots

(Add screenshots here after deployment)

---

## 💼 Why This Project Matters

This project demonstrates:

* Real-world SaaS architecture
* Real-time system design
* Full-stack development skills
* Clean UI/UX thinking

---

## 👨‍💻 Author

Harsh Pandey
GitHub: https://github.com/Harshpandeyiitian04
LinkedIn: https://www.linkedin.com/in/harsh-pandey-6514902ba/

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
