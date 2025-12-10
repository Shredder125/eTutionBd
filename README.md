# 🎓 eTuitionBd: Full-Stack Tuition Management Platform

A robust, role-based web application built using the MERN stack (MongoDB, Express, React, Node.js) designed to connect students with verified tutors, manage tuition postings, and process secure payments.

## 🔗 Live Demo & Credentials

 Live Site Link : 
| :--- | :--- | :--- | :--- | :--- |


***

## ✨ Key Features & Functionality

This project addresses all core requirements and includes advanced features like payment integration, comprehensive role management, and pagination/filtering challenges.

### 🛡️ Role-Based Dashboards
The application securely segments functionality based on the user's role, verified by JWT and Firebase.
* **Student Dashboard:** Post new tuition requests, view applicants, make payments, track post status.
* **Tutor Dashboard:** Browse available jobs, apply for tuitions, track application status, view earnings history.
* **Admin Dashboard:** Manage user roles, approve/reject tuition posts, view platform analytics (revenue, users, applications).

### 🔍 Challenge Requirements
* **Pagination:** Implemented pagination controls on the main Tuitions listing page.
* **Search & Filter:** Users can search jobs by **Subject** or **Location** and apply **Advanced Filters** by **Class/Grade**.

***

## 💻 Technical Stack & Dependencies

The project uses a modern development environment powered by **Vite** and relies on a comprehensive set of technologies across the client and server.

### 🚀 Client Dependencies (Frontend)

| Package | Purpose |
| :--- | :--- |
| **react**, **react-dom** | Core React library and DOM rendering. |
| **react-router-dom** | Declarative routing for navigation. |
| **@tanstack/react-query** | Data fetching, caching, and state management (used in many dashboard pages). |
| **axios** | HTTP client for backend API interaction. |
| **framer-motion** | Declarative animations (for homepage Hero/sections). |
| **lucide-react**, **react-icons** | A comprehensive set of modern SVG icons. |
| **react-countup** | Animates numerical data (used in Admin Stats page). |
| **react-hot-toast** | Lightweight, responsive notifications/alerts. |
| **firebase** | Client-side authentication and user management. |
| **sweetalert2** | Custom, engaging modals for confirmations (Delete, Reject, etc.). |
| **@stripe/react-stripe-js** | React components for Stripe Elements (UI). |
| **@stripe/stripe-js** | Loads the Stripe.js library (payment processing). |
| *Other essentials* | **localforage**, **match-sorter**, **sort-by**, **react-intersection-observer**, **react-hook-form** **clsx** **tailwind-merge** **react-countup**|

### 🌐 Server Dependencies (Backend)

| Package | Purpose |
| :--- | :--- |
| **express** | Fast, unopinionated Node.js web framework. |
| **mongodb** | Native driver to connect and interact with MongoDB Atlas. |
| **cors** | Middleware for enabling Cross-Origin Resource Sharing. |
| **jsonwebtoken** (JWT) | Creating and verifying JSON Web Tokens for authentication and authorization. |
| **dotenv** | Loads environment variables from a `.env` file. |
| **stripe** | Node.js library for communicating with the Stripe API (Payment Intent, Charges). |

### 🛠️ Dev Dependencies (Build Tools)

| Package | Purpose |
| :--- | :--- |
| **tailwindcss**, **postcss**, **autoprefixer** | Core CSS utilities, processing, and vendor prefixing (Tailwind v4 Setup). |
| **daisyui** | Tailwind CSS component library used for pre-styled UI elements. |
| **@tailwindcss/vite** | Vite plugin for integrating Tailwind CSS v4. |
| **@vitejs/plugin-react** | Essential plugin for running React with Vite. |
| **eslint** | Code quality checking and linting. |