# ✂️ ShearCraft Booking — Modern Barber Booking Platform

<br>

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://shearcraft-booking.vercel.app)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-red?style=for-the-badge)](../../issues/new?labels=bug)
[![Request Feature](https://img.shields.io/badge/✨_Request_Feature-blue?style=for-the-badge)](../../issues/new?labels=enhancement)

<br>

## 📌 Project Overview

ShearCraft Booking is a comprehensive, modern web application that enables barber shops to manage appointments and customers to book services seamlessly.
Built with Next.js, Tailwind CSS, and shadcn/ui, it delivers an intuitive user experience with robust security and fully responsive design.

## ✨ Features

### 🔐 Authentication & User Management
- Google OAuth & Email/Password login  
- Email verification & password reset with secure tokens  
- Role-Based Access Control (Admin / Customer)  
- Access & Refresh token–based session management with **Remember Me** support

---

### 📅 Booking System
- Real-time slot availability & conflict prevention  
- Service & package management with custom pricing/duration  
- Configurable time slots, business hours, lunch breaks, holidays  
- Booking history, modifications, cancellations, and exports  

---

### 👨‍💼 Admin Dashboard
- Modern, well-designed admin dashboard UI  
- User, service, and package management  
- Booking oversight with approvals, analytics, and exports  
- Real-time activity feed and system monitoring  

---

### 📧 Email System
- Account verification, booking confirmation, password reset  
- Responsive templates with React Email  
- SMTP-based reliable delivery and tracking  

---

### 🎨 User Interface
- Responsive, mobile-first design with **Tailwind CSS & shadcn/ui**  
- Navbar-level Light/Dark styling  
- Smooth animations and accessibility (WCAG)  
- Reusable components with consistent styling  

---

### 🔒 Security
- Access/Refresh token rotation  
- Strong password hashing (bcryptjs)  
- Input validation (Zod), Prisma SQL injection protection  
- CSRF, XSS protection, secure headers  

---

### 🚀 Performance & Optimization
- SSR & static generation with Next.js  
- Code splitting, lazy loading, and image optimization  
- Redis caching & API rate limiting  
- Optimistic UI updates and real-time session sync  

---

### 📱 Mobile & Cross-Platform
- Optimized for touch and gestures  
- Works across modern browsers and devices  
- PWA-ready for app-like experience  

---

### 🔧 Development & Maintenance
- TypeScript, ESLint, Prettier for code quality  
- Error boundaries and validation in place  
- Structured, production-ready codebase  
- Built with clean code principles and best practices  

---

### ⚡ Performance & Optimization
- SSR + static generation  
- Code splitting, lazy loading, and image optimization  
- **Redis (Upstash)** for caching & rate limiting  

### 📱 Responsive & UI
- Mobile-first design  
- Clean, polished **Admin Dashboard UI**  
- Light/Dark styling limited to navbar  

### 🔧 Development
- pnpm, Turbopack for fast builds  
- ESLint + Prettier for code quality  
- Error boundaries & structured codebase  
- Built with clean code principles and best practices  
- AI-assisted with **Cursor AI**
  
<br>

## 🧰 Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge" height="32" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" height="32" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Badge" height="32" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui Badge" height="32" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma Badge" height="32" />
  <br>
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="NextAuth.js Badge" height="32" />
  <img src="https://img.shields.io/badge/bcryptjs-003B57?style=for-the-badge&logo=npm&logoColor=white" alt="bcryptjs Badge" height="32" />
  <img src="https://img.shields.io/badge/Nodemailer-0095D5?style=for-the-badge&logo=gmail&logoColor=white" alt="Nodemailer Badge" height="32" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge" height="32" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Badge" height="32" />
</p>

<br>

## 📥 Installation

### Prerequisites
- Node.js 18+  
- PostgreSQL  
- SMTP email service  
- Google OAuth credentials  

### Setup
```bash
git clone [repository-url]
cd shearcraft-booking

pnpm install
cp .env.example .env   # Configure variables in this file

pnpm db:migrate        # Run database migrations
pnpm dev               # Start development server

```

<br>

## 📜 License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

This project is licensed under the terms described in the [LICENSE](./LICENSE) file.

---

© 2025 Yusuf Okan Sirkeci — [Hereetria](https://github.com/Hereetria)
