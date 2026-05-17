# 🗓️ Smart Leave Management System — Frontend

A full-featured employee leave management web application built as a team project at Cognizant. The frontend is built with React and communicates with a Spring Boot REST API backend via JWT-authenticated endpoints.

---

## 🔗 Related Repositories

| Layer | Repository |
|---|---|
| Frontend (this repo) | [Smart_Leave_Management_Frontend](https://github.com/jatinraj2407/Smart_Leave_Management_Frontend) |
| Backend | [Smart_Leave_Management_Backend](https://github.com/jatinraj2407/Smart_Leave_Management_Backend) |

---

## ✨ Features

- 🔐 JWT-based login and session management
- 👤 Role-based views — Employee, Manager, and Admin dashboards
- 📋 Apply for leave with type selection and date range picker
- ✅ Manager approval / rejection workflow
- 📊 Leave balance tracker per employee
- 📬 Email notification integration (via backend mail service)
- 📱 Fully responsive UI across devices

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)

**Connects to:**

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm
- Backend server running on `http://localhost:8080` (see backend repo)

### Installation

```bash
git clone https://github.com/jatinraj2407/Smart_Leave_Management_Frontend.git
cd Smart_Leave_Management_Frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Make sure the backend is running before starting the frontend.

---

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/              # Route-level page components
│   ├── Login.js        # JWT login page
│   ├── Dashboard.js    # Role-based dashboard
│   ├── ApplyLeave.js   # Leave application form
│   ├── LeaveHistory.js # Past leave requests
│   └── AdminPanel.js   # Admin management view
├── services/           # API call functions (Axios)
├── context/            # Auth context / state management
├── App.js              # Root component with routing
└── index.js            # Entry point
```

> Note: Folder structure is approximate — refer to the src/ directory for exact layout.

---

## 👥 Team

This is a team project developed collaboratively, with separate ownership of the frontend and backend layers.

---

## 👤 Author (Frontend)

**T Jatin Raj**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jatin-raj-8667651b7/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/jatinraj2407)
