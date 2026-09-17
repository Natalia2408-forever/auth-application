# Auth Application — authentication system with JWT and social login

Full-stack authentication application built with Node.js/Express on the backend and React on the frontend, from scratch.

🔗 Live Demo: https://natalia2408-forever.github.io/auth-application/

🧩 Description
This is an educational full-stack project implementing a complete authentication flow: registration with password confirmation, login/logout, JWT access + refresh tokens, and social login through Google, Facebook and GitHub (OAuth via Passport.js). It also includes a small protected "Todos" page to demonstrate route protection after login.

🛠 Technologies

Backend
* Node.js / Express 5 – REST API server and routing.
* Sequelize – ORM for working with PostgreSQL (User and Token models).
* PostgreSQL – relational database.
* JWT (jsonwebtoken) – access and refresh token generation/verification.
* bcrypt – password hashing.
* Passport.js – Google, Facebook and GitHub OAuth strategies.
* cookie-parser & cors – handling httpOnly refresh-token cookies across origins.
* express-rate-limit – rate limiting on /login, /registration, /refresh to slow down brute-force attempts.
* Jest – unit tests for the auth controller (registration, login, refresh, logout).

Frontend
* React – built with functional components and Hooks (useState, useEffect, useContext) for a dynamic UI.
* React Router (HashRouter) – client-side navigation with protected/guest-only routes.
* Axios – HTTP client with credentials support for cookie-based refresh flow.
* Formik – form state and validation.
* SCSS (modules) – component-scoped, responsive styling.
* Font Awesome (@fortawesome/react-fontawesome) – only the specific icons actually used, imported individually instead of the full icon library.
* Vite – fast dev server and build tool.

🎯 Key Features
* Registration with client-side email/password validation and password confirmation.
* Instant login right after registration — no email step required.
* JWT access + refresh tokens, with silent refresh via an httpOnly cookie.
* Logout that revokes the refresh token and clears the cookie.
* Social login with Google, Facebook and GitHub via OAuth.
* Route guarding: pages for authenticated users only, and guest-only pages (login/register) redirect logged-in users away.
* A protected demo "Todos" page to showcase authenticated content.

▶️ How to run

Clone repository:
* git clone https://github.com/Natalia2408-forever/auth-application.git
* cd auth-application

Backend:
* cd backend
* npm install
* Copy .env.example to .env and fill in your own values
* npm run dev

Frontend:
* cd frontend
* npm install
* Copy .env.example to .env and fill in your own values
* npm start

🧪 Tests
* cd backend
* npm install
* npm test
