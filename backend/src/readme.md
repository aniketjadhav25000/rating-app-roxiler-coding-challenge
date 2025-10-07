# FullStack Rating App – Roxiler Systems Coding Challenge

This project is a Full-Stack Rating Application built as part of the Roxiler Systems FullStack Intern Coding Challenge (V1.1).  
It demonstrates the ability to design and implement a complete role-based rating system with authentication, secure backend APIs, and a modern frontend interface.

The application enables different user roles (System Administrators, Normal Users, and Store Owners) to interact with the platform based on their access level.  
Users can register, log in, view stores, submit/update ratings, and administrators can manage users and stores through dashboards.

---

## Project Overview

The Rating App is a web-based system where:  
- Normal Users can register, log in, and rate stores from 1–5.  
- Store Owners can monitor ratings and users who rated their stores.  
- Admins can manage stores, users, and oversee overall statistics.  

This project was developed according to the specifications provided in the Roxiler Systems FullStack Intern Coding Challenge (V1.1) and fulfills all listed requirements.  

---

## Directory Structure

<img width="463" height="691" alt="image" src="https://github.com/user-attachments/assets/ab12fba5-9823-4fbe-aad2-9c1bfc14aff4" />

<img width="508" height="870" alt="image" src="https://github.com/user-attachments/assets/eff55927-d3c1-45dc-a4da-7363176fead6" />

---

## Tech Stack

### Backend
- Node.js + Express.js  
- PostgreSQL (database)    
- JWT Authentication  

### Frontend
- React.js (Vite)  
- Tailwind CSS (via CDN)  
- Axios (API calls)  
- React Context API (Auth state management)  

---

## Features & Roles

### System Administrator
- Add stores, normal users, and admins.  
- Dashboard showing: total users, total stores, total ratings submitted.  
- Manage users (view, filter, sort).  
- Manage stores with ratings overview.  

### Normal User
- Register (signup) & log in.  
- Update password.  
- View/search all stores.  
- Submit or modify store ratings (1–5).  
- See overall store rating and their own rating.  

### Store Owner
- Log in & update password.  
- Dashboard: view users who rated their store, see average rating of their store.  

---

## Validations

- Name: 20–60 characters  
- Address: up to 400 characters  
- Password: 8–16 characters, must include at least one uppercase letter and one special character  
- Email: must follow valid email format  

---

## Getting Started
# 1. Clone the repository
```bash

git clone https://github.com/aniketjadhav25000/rating-app-roxiler-coding-challenge.git
cd rating-app
```

# 2. Backend Setup
cd backend
npm install

# Create .env file in /backend with the following:
```bash
PORT=5000
DATABASE_URL=postgresql://postgres:1234@localhost:5432/rating_app
JWT_SECRET=mysecretkey
```
```bash
# Start backend server

npx nodemon server.js
# Backend runs on http://localhost:5000
```
# 3. Frontend Setup
```bash
cd ../frontend/rating-app
npm install
npm run dev
# Frontend runs on http://localhost:5173
```
# screenshots : 

## Login Page :
<img width="1902" height="866" alt="image" src="https://github.com/user-attachments/assets/7aad38ab-d6c9-4d54-94bc-c34c46a6c8d2" />

## Signup Page : 
<img width="1919" height="857" alt="image" src="https://github.com/user-attachments/assets/3f4f4757-48ef-453e-8938-7239e22d83a8" />

## User Dashboard : 
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/dda241c7-3f51-4d3a-846e-0ab464c570ae" />

## Admin Dashboard : 
<img width="1912" height="865" alt="image" src="https://github.com/user-attachments/assets/2875090c-60f3-4b90-a5c2-22ce3812a9a7" />
<img width="1911" height="871" alt="image" src="https://github.com/user-attachments/assets/4b15b19c-c812-4f92-85f3-3335934bf6e2" />


## Owner Dashboard : 
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/6da83b96-44e9-41e2-adb8-30a0ae46f098" />
