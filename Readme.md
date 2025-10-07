
# FullStack Rating App – Roxiler Systems Coding Challenge

This project is a Full-Stack Rating Application built as part of the Roxiler Systems FullStack Intern Coding Challenge 
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

<img width="443" height="580" alt="image" src="https://github.com/user-attachments/assets/f56940a7-d5ed-4fbe-8e56-eb3dfcdfd1ef" />

<img width="661" height="884" alt="image" src="https://github.com/user-attachments/assets/938ee163-5153-430e-857d-f7d62a7d0d67" />

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


## 1. Clone the repository
```bash
git clone https://github.com/your-username/rating-app.git
cd rating-app
```

## 2. Backend Setup
```bash
cd backend
npm install
```
```bash
# Create .env file in /backend with the following:
PORT=5000
DATABASE_URL=postgresql://postgres:1234@localhost:5432/rating_app
JWT_SECRET=mysecretkey
```

## Start backend server
```bash
npx nodemon server.js
```
## Backend runs on http://localhost:5000

## 3. Frontend Setup
```bash

cd ../frontend/rating-app
npm install
npm run dev
```
## Frontend runs on http://localhost:5173


# Screenshots :

## login page : 
<img width="1911" height="865" alt="image" src="https://github.com/user-attachments/assets/1b61113f-fa17-478e-b5b0-901be87d3499" />

## Signup page :  
<img width="1917" height="864" alt="image" src="https://github.com/user-attachments/assets/591b219b-482c-4ef1-8dce-0aaff77cdf4f" />

## User Dashboard : 
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/9c2bfeed-e39a-4031-8c3d-7ff556a7fec9" />

## Admin Dashboard : 
<img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/915474fa-5d8b-4c4f-930a-5913736c3fce" />
<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/7b48e834-ca8f-4078-b261-8f1462d14fdc" />

## Owner Dashboard : 
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/5fd50e29-aaf6-4f63-a8ff-2b2928c35739" />

