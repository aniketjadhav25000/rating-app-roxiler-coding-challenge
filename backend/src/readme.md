# Roxiler Systems FullStack Intern Coding Challenge Solution: Rating App

## 🎯 Project Overview

This repository contains the full-stack solution for the **Roxiler Systems Coding Challenge**.

[cite_start]The application is a web platform for rating stores (1-5 stars), built with **Role-Based Access Control (RBAC)** for System Administrator, Normal User, and Store Owner roles[cite: 1, 36, 55].

### Key Challenge Requirements Implemented

* [cite_start]**Authentication & Authorization:** Single login system with role-based access to functionalities[cite: 8, 9].
* [cite_start]**Three User Roles:** Administrator, Normal User, and Store Owner[cite: 12, 13, 14].
* [cite_start]**Strict Form Validation:** All forms (Signup, Add User, etc.) enforce the required minimum/maximum lengths and complexity rules for Name, Address, Email, and Password[cite: 63, 64, 65, 66, 67].
* **Database Schema:** Implemented using **PostgreSQL** with tables for `users`, `stores`, and `ratings`.

---

## 💻 Tech Stack & Architecture

The project is divided into two distinct parts: a Frontend client and a Backend API.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **ReactJS** (Vite) | Utilizes Vite for a fast development experience and React for the UI. |
| **Styling** | **Tailwind CSS (CDN)** | Rapidly styling with utility classes via a CDN link. |
| **Backend** | **Node.js with ExpressJS** | Serves the REST API and handles all business logic and database operations. |
| **Database** | **PostgreSQL** | The application's data layer, managed locally via `pgAdmin 4`. |
| **Routing** | **Frontend:** `react-router-dom` (implied by file structure) / **Backend:** Clear route separation (`adminRoutes.js`, `authRoutes.js`, etc.). |

### Directory Structure

The repository follows a clear segregated structure:
<img width="589" height="496" alt="image" src="https://github.com/user-attachments/assets/4913a8e5-4859-4fc9-9f81-bf315fd68173" />


---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* PostgreSQL Database Server (Local or Cloud)

### Step 1: Backend & Database Setup

1.  **Navigate to the Backend:**
    ```bash
    cd backend/
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Database:**
    * Ensure your PostgreSQL service is running.
    * Create a database named `rating_app` (or as configured in your `.env` file).
    * Run database migrations to create the required tables (`users`, `stores`, `ratings`):
        ```bash
        # (Example migration command, adjust as per your framework)
        npm run migrate 
        ```
    * The `users` table schema includes `id`, `name`, `email`, `password_hash`, `address`, and `role`.
    * The `stores` table includes `owner_id` with an `ON DELETE SET NULL` Foreign Key constraint to the `users` table.
4.  **Start the Backend Server:**
    ```bash
    npm start 
    # Server running on http://localhost:5000
    ```

### Step 2: Frontend Setup

1.  **Navigate to the Frontend Client:**
    ```bash
    cd ../frontend/rating-app/
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    # The application will launch on a local port, e.g., http://localhost:5173
    ```

---

## 🔐 User Roles and Default Credentials

The application uses an initial set of credentials for testing. **These should be reset immediately after the first login.**

### **Initial Credentials**

| Role | Login ID (Email) | Password | Notes |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `[Check your seed file]` | `[Check your seed file]` | [cite_start]Full management access (Add Stores, Add Users, etc.)[cite: 17]. |
| **Store Owner** | `[Register or Check your seed file]` | `[N/A]` | [cite_start]Manages their store's ratings and view user submissions[cite: 58, 59, 60]. |
| **Normal User** | `[Register via Signup page]` | `[N/A]` | [cite_start]Can view stores and submit/modify ratings[cite: 51, 52]. |

### **Database Schema Details**

The `users` table contains the required user details: `name`, `email`, `address`, and `role`. The `role` column is the key differentiator for access control.

---

## ⚠️ Known Issues and Development Status

The following issues were observed during development and testing:

1.  **User Deletion Error:** The Admin Dashboard's "Delete User" button results in a `DELETE http://localhost:5000/api/admin/users/2 404 (Not Found)` error, indicating the admin delete endpoint is missing or incorrectly configured.
2.  **Store Creation Validation Error:** Attempting to create a new store results in a `500 Internal Server Error` and a message stating: `"Error creating store. Check if owner_id exists and is unique."` This suggests a server-side bug with either the `owner_id` lookup or a constraint violation when assigning the owner.

These known issues highlight areas for further refinement in the backend controllers (`adminController.js`, `ownerController.js`) and corresponding API routes (`adminRoutes.js`).
