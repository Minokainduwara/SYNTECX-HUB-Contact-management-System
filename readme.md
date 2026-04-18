<div align="center">

# 🌸 Contact Garden (Contact Management System)

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br/>

**A modern, full-stack Contact Management SaaS built with the MERN stack and TypeScript.**
Organize your contacts with favorites, pins, real-time search, and a beautiful sakura-themed UI.

<br/>

[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-Visit_Now-E8849A?style=for-the-badge)](https://minoka.dev)
[![GitHub](https://img.shields.io/badge/GitHub-minoka--dev-181717?style=for-the-badge&logo=github)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/your-profile)

</div>

---

## 📸 Preview

> _Add your screenshots here — home page, login, and dashboard views_

| Home | Login | Dashboard |
|------|-------|-----------|
| ![home](screenshots/home.png) | ![login](screenshots/login.png) | ![dashboard](screenshots/dashboard.png) |

---

## ✨ Features

### 🔐 Authentication
- JWT-based secure login & registration
- Password hashing with **bcrypt**
- Protected API routes via auth middleware
- Persistent sessions with token storage

### 📇 Contact Management
- **Create, Read, Update, Delete** contacts
- Store **name**, **email**, and **phone number**
- Mark contacts as ⭐ **Favorite**
- Pin important contacts with 📌 **Pin**
- All data is **user-specific** — fully isolated per account

### 🔍 Search & UX
- **Real-time search** across name, email, and phone
- Animated sakura 🌸 petal particle effects on mouse movement
- Fully responsive layout with **Tailwind CSS**
- Smooth entrance animations and micro-interactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Dev Tools** | Vite, ts-node, nodemon, ESLint |

---

## 📁 Project Structure

```
contact-manager/
│
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 controllers/      # Route handler logic
│   │   ├── 📂 models/           # Mongoose schemas
│   │   ├── 📂 routes/           # Express route definitions
│   │   ├── 📂 middlewares/      # JWT auth middleware
│   │   └── 📄 app.ts            # Express app setup
│   └── 📄 server.ts             # Entry point
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/       # Reusable UI components
│   │   ├── 📂 pages/            # Route-level page components
│   │   ├── 📂 services/         # Axios API service layer
│   │   ├── 📂 types/            # Shared TypeScript interfaces
│   │   └── 📄 App.tsx           # Root component & routing
│   └── 📄 index.html
│
└── 📄 README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/contact-manager.git
cd contact-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the development server:

```bash
npm run dev
```

> Backend runs at `http://localhost:5001`

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the development server:

```bash
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## 🔐 API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT | ❌ |

### Contact Endpoints

> All contact routes require a valid `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/contacts` | Fetch all user contacts | ✅ |
| `POST` | `/api/contacts` | Create a new contact | ✅ |
| `PUT` | `/api/contacts/:id` | Update a contact | ✅ |
| `DELETE` | `/api/contacts/:id` | Delete a contact | ✅ |

#### Example Request — Create Contact

```json
POST /api/contacts
Authorization: Bearer <your_token>

{
  "name": "Minoka Wickramasinghe",
  "email": "minoka@example.com",
  "phone": "+94 77 123 4567",
  "isFavorite": true,
  "isPinned": false
}
```

---

## 🚀 Roadmap

- [x] JWT Authentication
- [x] CRUD Contact Management
- [x] Favorites & Pinning
- [x] Real-time Search
- [x] Sakura Particle UI Effects
- [ ] 🌙 Dark Mode
- [ ] 🖱️ Drag & Drop to reorder contacts
- [ ] 👤 User profile & avatar system
- [ ] 📊 Analytics dashboard
- [ ] 📱 Flutter mobile app
- [ ] 🏷️ Contact tags & groups
- [ ] 📤 Export contacts to CSV / vCard

---

## 👨‍💻 Developer

<div align="center">

<img src="https://github.com/your-username.png" width="100" style="border-radius:50%" alt="Minoka Wickramasinghe"/>

### Minoka Wickramasinghe

**Full Stack Developer** · MERN · TypeScript · Java · Python

[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-minoka.dev-E8849A?style=flat-square)](https://minoka.dev)
[![GitHub](https://img.shields.io/badge/GitHub-@your--username-181717?style=flat-square&logo=github)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Minoka_Wickramasinghe-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/your-profile)
[![Email](https://img.shields.io/badge/Email-minoka@example.com-EA4335?style=flat-square&logo=gmail)](mailto:minoka@example.com)

</div>

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

```
MIT License — free to use, modify, and distribute for learning and personal projects.
Attribution appreciated but not required.
```

---

<div align="center">

Made with 🌸 by **Minoka Wickramasinghe**

*If you found this project helpful, please consider giving it a ⭐ on GitHub!*

</div>