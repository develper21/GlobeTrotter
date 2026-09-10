# 🚀 GlobeTrotter Deployment Guide

Complete step-by-step guide to deploy **Server (Backend) on Render** and **Website (Frontend) on Netlify**.

---

## 📋 Overview

| Component | Service | What it is | Live URL Example |
|---|---|---|---|
| **Backend** | [Render](https://render.com) | Express + Prisma + Node.js API | `https://globetrotter-server.onrender.com` |
| **Frontend** | [Netlify](https://netlify.com) | Vite + React SPA | `https://globetrotter-app.netlify.app` |
| **Database** | Render PostgreSQL / Neon / Supabase | PostgreSQL Database | Connection String (`DATABASE_URL`) |

---

## 🛠️ Step 1: Deploy Backend & Database on Render

You can deploy the backend using **Option A (Render Blueprint - Easiest)** or **Option B (Manual Setup)**.

### Option A: Using Render Blueprint (`render.yaml`) — Recommended ⭐
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure deployment for Render and Netlify"
   git push origin main
   ```
2. Log in to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically read `render.yaml` and configure:
   - Web Service: `globetrotter-server`
   - Database: `globetrotter-db` (Free PostgreSQL)
   - Automatically link `DATABASE_URL` and generate `JWT_SECRET`.
6. Click **Apply**.
7. Once deployed, note down your Render service URL (e.g., `https://globetrotter-server.onrender.com`).

---

### Option B: Manual Setup on Render

#### 1. Create PostgreSQL Database
1. In Render Dashboard, click **New +** > **PostgreSQL**.
2. Name: `globetrotter-db`
3. Database: `globetrotter`
4. Region: Choose closest to your users (e.g., Oregon, Frankfurt, Singapore).
5. Plan: **Free**.
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (if deploying backend on Render) or **External Database URL**.

#### 2. Create Web Service for Backend
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `globetrotter-server`
   - **Language**: `Node`
   - **Root Directory**: `server`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```bash
     npx prisma migrate deploy && npm start
     ```
   - **Plan**: `Free`
4. Scroll down to **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port Render listens on |
   | `DATABASE_URL` | `postgresql://...` | Copied from your PostgreSQL database |
   | `JWT_SECRET` | *(Generate a secure random string)* | E.g. `openssl rand -hex 32` |
   | `FRONTEND_URL` | `https://your-site.netlify.app` | Add after deploying frontend or temporary `*` |
   | `ALLOWED_ORIGINS` | `https://your-site.netlify.app,*.netlify.app` | Allows your Netlify domain |
   | `CLOUDINARY_CLOUD_NAME` | *(Optional - your cloud name)* | For image uploads |
   | `CLOUDINARY_API_KEY` | *(Optional - your API key)* | For image uploads |
   | `CLOUDINARY_API_SECRET` | *(Optional - your API secret)* | For image uploads |
5. Under **Advanced**, set **Health Check Path**: `/api/health`.
6. Click **Create Web Service**.
7. Once deployed, your backend URL will be:
   `https://globetrotter-server.onrender.com`

---

## 🌐 Step 2: Deploy Frontend on Netlify

1. Log in to your [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and authorize access to your repository.
4. Configure Build settings:
   - **Base directory**: `website`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (or `website/dist` if Base directory is empty)
5. Expand **Environment variables** > **Add a variable**:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_URL` | `https://globetrotter-server.onrender.com/api` | Your Render backend URL + `/api` |
6. Click **Deploy globetrotter**.
7. Once deployed, Netlify will provide your site domain (e.g., `https://creative-travel-12345.netlify.app`).
   *(You can change site name under Site configuration > Site details > Change site name).*

---

## 🔗 Step 3: Connect Frontend & Backend (Final Sync)

1. Copy your final Netlify URL (e.g., `https://globetrotter-travel.netlify.app`).
2. Go back to [Render Dashboard](https://dashboard.render.com) > your `globetrotter-server` service > **Environment**.
3. Update the following environment variables:
   - `FRONTEND_URL` = `https://globetrotter-travel.netlify.app`
   - `ALLOWED_ORIGINS` = `https://globetrotter-travel.netlify.app,*.netlify.app`
4. Render will automatically redeploy with the updated CORS configuration.

---

## 🌱 Step 4 (Optional): Seed Initial Data

If you want to populate the database with initial destinations, cities, and activities:
1. In Render Dashboard, go to your `globetrotter-server` Web Service.
2. Click the **Shell** tab on the left.
3. Run:
   ```bash
   npm run prisma:seed
   ```
4. Initial sample cities and activities will now be available in your application!

---

## ✅ Troubleshooting & Tips

- **Free Tier Sleep**: Render's free tier spins down web services after 15 minutes of inactivity. The first request might take 30-50 seconds to respond as it wakes up.
- **SPA Routing (404 on page refresh)**: Fixed automatically via `website/public/_redirects` and `netlify.toml`.
- **CORS Error**: Check that `ALLOWED_ORIGINS` on Render contains your exact Netlify domain (trailing slashes are automatically handled).
- **Health Check**: Test your backend by visiting `https://your-server.onrender.com/api/health` in your browser. It should return:
  ```json
  {"status":"UP","message":"GlobeTrotter API is healthy"}
  ```
