# Deployment Guide

This project is designed to be easily deployed to modern cloud platforms. Below are the instructions for deploying the Server, Client, and Database for free.

## 1. Database (Neon / Supabase)

We need a Postgres database accessible from the internet.
**Recommendation**: [Neon.tech](https://neon.tech) (Free Tier)

1. Sign up at Neon.tech.
2. Create a new Project.
3. Copy the **Connection String** (e.g., `postgres://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require`).
4. You will use this as the `DATABASE_URL` environment variable in your Server deployment.

## 2. Server (Vercel)

**Credit Card Free Alternative!**
We will deploy the Server to Vercel as well (using Serverless Functions).

1. Push your code to GitHub.
2. Sign up/Log in to Vercel.
3. **Add New... -> Project**.
4. Import your repository.
5. **Configure Project**:
   - **Root Directory**: `packages/server` (Click Edit to change this!)
   - **Framework**: Other (Default)
   - **Build Command**: `bun install` (or leave empty)
   - **Environment Variables**:
     - `DATABASE_URL`: (Paste your Neon connection string)
6. Click **Deploy**.

## 3. Client (Vercel)

Once the server is deployed, copy its URL (e.g., `https://my-server-app.vercel.app`).

1. **Add New... -> Project** (Again).
2. Import the **SAME** repository.
3. **Configure Project**:
   - **Root Directory**: `packages/client`
   - **Environment Variables**:
     - `VITE_API_URL`: Paste the **Server URL** from step 2 (without trailing slash).
4. Click **Deploy**.

---

## 4. Running Locally with Docker

If you have Docker installed, you can run the entire stack with one command:

```bash
docker-compose up --build
```

This will start:

- **Server**: http://localhost:3000
- **Client**: http://localhost:8080
- **Database**: localhost:5434
