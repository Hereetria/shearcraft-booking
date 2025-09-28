## 🎯 Project Overview

ShearCraft Booking is a comprehensive, modern web application for barber shops to manage appointments and for customers to book services seamlessly.  
Built with cutting-edge technologies, it delivers an intuitive user experience with robust security and real-time functionality.

## 🚀 Live Demo
[https://shearcraft-booking.vercel.app](https://shearcraft-booking.vercel.app)

## ✨ Features

### 🔐 Authentication & User Management
- Google OAuth & Email/Password login  
- Email verification & password reset with secure tokens  
- Role-Based Access Control (Admin / Customer)  
- Access & Refresh token–based session management with **Remember Me** support  

### 📅 Booking System
- Real-time slot availability & conflict prevention  
- Service & package management with custom pricing/duration  
- Configurable time slots, business hours, lunch breaks, holidays  
- Booking history, modifications, cancellations, and exports  

### 👨‍💼 Admin Dashboard
- Modern, well-designed admin dashboard UI  
- User, service, and package management  
- Booking oversight with approvals, analytics, and exports  
- Real-time activity feed and system monitoring  

### 📧 Email System
- Account verification, booking confirmation, password reset  
- Responsive templates with React Email  
- SMTP-based reliable delivery and tracking  

### 🎨 User Interface
- Responsive, mobile-first design with **Tailwind CSS & shadcn/ui**  
- Navbar-level Light/Dark styling  
- Smooth animations and accessibility (WCAG)  
- Reusable components with consistent styling  

### 🔒 Security
- Access/Refresh token rotation  
- Strong password hashing (bcryptjs)  
- Input validation (Zod), Prisma SQL injection protection  
- CSRF, XSS protection, secure headers  

### 🚀 Performance & Optimization
- SSR & static generation with Next.js  
- Code splitting, lazy loading, and image optimization  
- Redis caching & API rate limiting  
- Optimistic UI updates and real-time session sync  

### 📱 Mobile & Cross-Platform
- Optimized for touch and gestures  
- Works across modern browsers and devices  
- PWA-ready for app-like experience  

### 🔧 Development & Maintenance
- TypeScript, ESLint, Prettier for code quality  
- Error boundaries and validation in place  
- Structured, production-ready codebase  
- Built with clean code principles and best practices  
- Cursor AI assisted development (especially in design)  

## ⚙️ Technical Highlights

### 🚀 Core
- **Next.js 15** with App Router, SSR & SSG  
- **React 19** with concurrent features  
- **TypeScript 5** for type safety  
- **Node.js 18+** runtime  

### 🎨 Frontend
- **Tailwind CSS + shadcn/ui** component system  
- **Lucide React** icons  
- **React Hook Form + Zod** for forms & validation  

### 🗄️ Database & Backend
- **PostgreSQL** (ACID compliant)  
- **Prisma ORM** with migrations  
- **Next.js API Routes** for serverless APIs  

### 🔐 Authentication & Security
- **NextAuth.js** (Google OAuth + Email/Password)  
- **Access & Refresh Tokens** with rotation  
- **bcryptjs** for password hashing  
- CSRF, XSS, and SQL injection prevention  

### 📧 Email
- **React Email** templates  
- **Nodemailer + SMTP** for delivery  

### ⚡ Performance & Optimization
- SSR + static generation  
- Code splitting, lazy loading, and image optimization  
- **Redis (Upstash)** for caching & rate limiting  

### 📱 Responsive & UI
- Mobile-first design  
- Clean, polished **Admin Dashboard UI**  
- Light/Dark styling limited to navbar  

### 🔧 Development
- **pnpm**, **Turbopack** for fast builds  
- **ESLint + Prettier** for code quality  
- Error boundaries & structured codebase  
- Built with **clean code principles** and **best practices**  
- **Cursor AI** used extensively for design and code generation  

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
