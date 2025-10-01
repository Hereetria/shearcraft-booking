# ShearCraft Booking — Modern Barber Booking Platform

<br>

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://shearcraft-booking.vercel.app)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-red?style=for-the-badge)](../../issues/new?labels=bug)
[![Request Feature](https://img.shields.io/badge/✨_Request_Feature-blue?style=for-the-badge)](../../issues/new?labels=enhancement)

<br>

## 🎯 Project Overview

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

### 🧭 Frontend

<p>
  <a href="https://nextjs.org/"><img src="./assets/nextjs-logo.svg" alt="Next.js Logo" height="32" /></a>
  <a href="https://www.typescriptlang.org/"><img src="./assets/typescript-logo.svg" alt="TypeScript Logo" height="32" /></a>
  <a href="https://tailwindcss.com/"><img src="./assets/tailwindcss-logo.svg" alt="Tailwind CSS Logo" height="32" /></a>
  <a href="https://ui.shadcn.com/"><img src="./assets/shadcnui-logo.svg" alt="shadcn/ui Logo" height="32" /></a>
</p>

---

## ⚙️ Backend

<p>
  <a href="https://www.prisma.io/"><img src="./assets/prisma-logo.svg" alt="Prisma Logo" height="32" /></a>
  <a href="https://next-auth.js.org/"><img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="NextAuth.js Badge" height="32" /></a>
  <a href="https://www.npmjs.com/package/bcryptjs"><img src="https://img.shields.io/badge/bcryptjs-003B57?style=for-the-badge&logo=npm&logoColor=white" alt="bcryptjs Badge" height="32" /></a>
  <a href="https://nodemailer.com/"><img src="https://img.shields.io/badge/Nodemailer-0095D5?style=for-the-badge&logo=gmail&logoColor=white" alt="Nodemailer Badge" height="32" /></a>
</p>

---

## 🗄️ Database

<p>
  <a href="https://www.postgresql.org/"><img src="./assets/postgresql-logo.svg" alt="PostgreSQL Logo" height="32" /></a>
</p>

---

## 🧰 Platforms & Tools

<p>
  <a href="https://vercel.com/"><img src="./assets/vercel-logo.svg" alt="Vercel Logo" height="32" /></a>
  <a href="https://github.com/"><img src="./assets/github-logo.svg" alt="GitHub Logo" height="32" /></a>
  <a href="https://cursor.sh/"><img src="./assets/cursor-logo.svg" alt="Cursor AI Logo" height="32" /></a>
</p>

<br>

## ⚙️ Installation

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
