# StreamShelf

A fullstack movie catalog and watchlist app inspired by streaming platforms. Users register, browse and search a catalog of Bengali films, and keep a personal watchlist. Admins manage the catalog.

![CI](https://github.com/SarbojitGit/streamshelf/actions/workflows/ci.yml/badge.svg)

## Tech stack

- **Frontend:** React, TypeScript, Vite, React Router, Context API
- **Backend:** NestJS, TypeScript, Mongoose, Passport JWT, class-validator
- **Database:** MongoDB (Atlas or local container)
- **Testing and CI:** Jest, Supertest, GitHub Actions
- **Containers:** Docker, Docker Compose, nginx

## Features

- Register and log in with bcrypt-hashed passwords and JWT authentication
- Role-based access control (`user` and `admin`) using NestJS guards
- Movie catalog with title search, genre filter and pagination
- Per-user watchlist with duplicate protection (unique compound index)
- DTO validation and consistent error responses
- Auth and watchlist state shared through React Context

## API

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create an account, returns a JWT |
| POST | `/auth/login` | Public | Log in, returns a JWT |
| GET | `/auth/me` | Logged in | Current user from the token |
| GET | `/movies` | Public | List movies (`q`, `genre`, `page`, `limit`) |
| GET | `/movies/:id` | Public | Get one movie |
| POST | `/movies` | Admin | Create a movie |
| DELETE | `/movies/:id` | Admin | Delete a movie |
| GET | `/watchlist` | Logged in | List my watchlist |
| POST | `/watchlist/:movieId` | Logged in | Add a movie |
| DELETE | `/watchlist/:movieId` | Logged in | Remove a movie |

## Run locally

Requirements: Node 24+ and a MongoDB connection string (Atlas free tier works).

```bash
# Backend
cd backend
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm run start:dev         # http://localhost:3000

# Frontend (in another terminal)
cd frontend
echo "VITE_API_URL=http://localhost:3000" > .env
npm install
npm run dev               # http://localhost:5173
```

## Run with Docker

```bash
docker compose up --build
```

Then open http://localhost:8080. The database starts empty, so register an account first.

## Making an admin

New accounts get the `user` role. To create an admin, change a user's `role` to `admin` in the database, then log in again to get a fresh token. With Docker:

```bash
docker compose exec mongo mongosh streamshelf --eval 'db.users.updateOne({email:"you@example.com"},{$set:{role:"admin"}})'
```

## Tests

```bash
cd backend
npm test
```

Unit tests cover the auth service, and Supertest HTTP tests cover validation and the auth endpoints. GitHub Actions runs the backend build and tests, and lints and builds the frontend, on every push.

## Notes on AI-assisted development

Built with Claude as an AI pair programmer. Every change was tested by hand and generated output was corrected where needed, for example:

- Enabled request validation after finding that a 3-character password was accepted
- Removed an unneeded generated telemetry module
- Fixed CI after the ESM-only NestJS and Jest setup needed Node 24