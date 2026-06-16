## http://myzk-project-folio.vercel.app


## Overview

ProjectFolio is a role-based academic portfolio and internship management platform designed to connect students, instructors, and employers within a unified ecosystem. The platform aims to bridge the gap between academia and industry by allowing students to showcase their projects and skills, instructors to evaluate and recommend projects, and employers to discover talent and internship candidates through project-based portfolios.

The system provides tailored experiences for each user role while maintaining a centralized environment for project discovery, portfolio review, and internship opportunities.

---

## How It Works

### Students

Students can browse internship opportunities, explore recommended projects, manage applications, and showcase their skills through searchable portfolios.

### Instructors

Instructors can review student portfolios, discover students through skill-based search, and explore recommended projects for evaluation and guidance.

### Employers

Employers can browse recommended student projects, discover talented candidates, review portfolios, and manage internship opportunities.

The platform also includes project discovery tools, rating-based filtering, notification management, portfolio search, and role-specific dashboards to provide an intuitive and efficient user experience.

---

## Key Features

* Multi-role authentication system (Student, Instructor, Employer)
* Role-specific dashboards and workflows
* Internship discovery and management
* Project recommendation system
* Project library with search and rating filters
* Skill-based student portfolio search
* Instructor directory search
* Persistent notification management
* Responsive and modern user interface
* Client-side data persistence using Local Storage

---

## Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* React Router
* React Hooks (`useState`, `useEffect`)
* Tailwind CSS

### Data & State Management

* Browser Local Storage
* Client-side state management with React Hooks

### Development Tools

* Git
* GitHub
* Vercel / GitHub Pages (Deployment)

---

## Architecture

ProjectFolio is implemented as a Single Page Application (SPA) using React. The application uses role-based rendering to dynamically display dashboards and features depending on the authenticated user type.

Application state is managed using React Hooks, while Local Storage is used to persist user sessions, notifications, preferences, and application data across browser refreshes.

---

## Note

This project is a frontend-focused implementation intended to demonstrate user workflows, interface design, state management, and role-based functionality.

**No backend services, APIs, or databases are currently implemented.** All data persistence is handled through browser Local Storage, making the project ideal for UI/UX demonstration and frontend architecture exploration
