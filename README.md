# 🚀 CollabCore — AI-Assisted Real-Time Collaborative Editor

CollabCore is a **full-stack, real-time collaborative document editor** inspired by tools like Google Docs and Notion — built from scratch using modern web technologies.

It enables multiple users to **edit documents simultaneously**, track activity, collaborate through comments, and enhance writing using **AI-powered assistance** — all in real time.

---

## ✨ Key Highlights

* ⚡ Real-time multi-user editing (WebSocket-based)
* 👥 Live presence + cursor tracking
* 💬 Inline commenting with threads & replies
* 🧠 AI-powered writing assistant (LLaMA 3.1)
* 🕒 Version history with restore functionality
* 💾 Smart auto-save system
* 🔗 Shareable document links
* 🎨 Multi-theme UI (Light / Dark / Neon)
* 🔐 Secure authentication (JWT-based)

---

## 🧠 What Makes It Stand Out

Unlike basic editors, CollabCore implements a **complete collaborative system**:

* **Event-driven architecture** using Socket.IO
* **Conflict-free real-time updates**
* **Smart identity system** (unique user names + colors)
* **Efficient auto-save (only on changes)**
* **AI integration for content transformation**
* **Production-level modular architecture**

---

## 🏗️ Tech Stack

### Frontend

* React + TypeScript (Vite)
* Tailwind CSS + shadcn/ui
* TipTap (ProseMirror-based editor)
* Zustand (state management)
* Socket.IO Client

### Backend

* Node.js + Express (TypeScript, ESM)
* MongoDB (Mongoose)
* Socket.IO (real-time engine)
* Zod (validation)
* JWT (authentication)
* bcrypt (password hashing)

### AI Integration

* Groq SDK
* LLaMA 3.1-8B model

---

## ⚡ Core Features

### 🔐 Authentication (SaaS-Level)

* Signup & Login with JWT
* Secure password hashing (bcrypt)
* Protected routes using middleware
* Global auth state (Zustand)

---

### 📂 Document Dashboard

* View all documents
* Create / delete documents
* Responsive grid layout
* Shows last updated timestamp
* Clean empty state UI

---

### ✏️ Rich Text Editor

Built with TipTap, supports:

* Bold / Italic / Underline
* Headings
* Code blocks
* Bullet lists (multiple styles)
* Ordered lists (multiple formats)

Keyboard shortcuts supported (Ctrl+B, Ctrl+I, etc.)

---

### 🌐 Real-Time Collaboration

* Instant content sync via WebSockets
* No polling (pure event-driven updates)
* Document-based rooms using `publicId`

---

### 👥 Live Presence System

* Shows active users in real-time
* Auto updates on join/leave
* Unique name + color per user

---

### 🖱️ Live Cursor Tracking

* Displays user position inside document
* Color-coded cursor labels
* Real-time updates on selection change

---

### 💾 Smart Auto-Save

* Saves every 2 seconds (only if content changes)
* Prevents unnecessary database writes
* Fully automatic (no manual save required)

---

### 🕒 Version History

* Snapshot created on every save
* View previous versions
* Restore any version instantly

---

### 💬 Commenting System

* Add comments on selected text
* Supports threaded replies
* Resolve comments
* Real-time sync across users

---

### 🤖 AI Assistant

* Summarize document content
* Improve writing quality
* Powered by LLaMA 3.1 (Groq)
* Fast and lightweight responses

---

### 📊 Activity Timeline

Tracks user actions like:

* Joined / left document
* Edits
* Saves
* AI usage

---

### 🔗 Document Sharing

* Share via public link
* Instant access for collaborators
* Clipboard copy support

---

### 🎨 Theme System

* Light mode (clean UI)
* Dark mode (eye-friendly)
* Neon mode (modern glowing UI)

Themes persist using localStorage.

---

## 🗺️ System Architecture

```
Client (React + TipTap)
        │
        ▼
Socket.IO Client
        │
        ▼
Node.js Server (Express + Socket.IO)
        │
 ┌──────┼──────────┐
 ▼      ▼          ▼
MongoDB  AI API   Version Store
```

---

## 🔄 Real-Time Flow

1. User types → `send-changes`
2. Server receives → broadcasts
3. Other users → `receive-changes`
4. Editor updates instantly

---

## 📦 Installation

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/collabcore.git
cd collabcore
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENAI_API_KEY=your_api_key
```

Run:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

| Variable       | Description        |
| -------------- | ------------------ |
| MONGO_URI      | MongoDB connection |
| JWT_SECRET     | JWT signing key    |
| OPENAI_API_KEY | AI integration     |

---

## 🚀 Deployment

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---

## 💡 Key Engineering Decisions

* Modular backend structure (feature-based)
* ESM + TypeScript everywhere
* Socket rooms per document
* Optimized auto-save (diff-based)
* Custom TipTap extensions (comments, lists)

---

## 📈 Future Improvements

* Role-based access (viewer/editor)
* Team workspaces
* Notifications system
* File attachments

---

## License

[MIT](./LICENSE)

---

## 👨‍💻 Author

**Prachi Patel**

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---
