# Deployment Guide

## Frontend (Vercel)
1. **Import Project**: Connect your GitHub repository to Vercel.
2. **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (Leave as default)
   - **Build Command**: `npm run build:frontend`
   - **Output Directory**: `frontend/.next`
   - **Install Command**: `npm install`
3. **Environment Variables**: Add any public env vars prefixed with `NEXT_PUBLIC_`.

## Backend (Render)
1. **Create Web Service**: Connect your GitHub repository to Render.
2. **Settings**:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:backend`
   - **Root Directory**: `.` (Default)
3. **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: Secret for JWT.
   - Other variables from `.env`.

## Notes
- Ensure all dependencies are in the root `package.json`.
- Both services will deploy from the same repository but use different commands.
