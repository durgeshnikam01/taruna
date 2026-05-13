# Taruna Proposals - Deployment Guide

The project is now fully optimized and ready for production. Below is the environment setup and deployment strategy.

## 1. Environment Configuration

You must set these environment variables in your hosting provider's dashboard (e.g., Render, Railway, or Vercel).

### Backend Variables (`backend`)
| Variable | Value (Example) | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations and static serving. |
| `PORT` | `10000` | The port provided by your host. |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string. |
| `JWT_SECRET` | `your_long_random_secret_here` | A strong key for session security. |
| `GROQ_API_KEY` | `gsk_...` | Your Groq Cloud API Key. |

### Frontend Variables (`frontend`)
| Variable | Value (Example) | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `/api` | **CRITICAL**: Set this to `/api` for unified deployment. |

---

## 2. Deployment Strategy (Recommended: Render All-in-One)

Since the backend is already configured to serve the frontend build, you can deploy both together.

### Step 1: Root Build Configuration
If your host supports a root-level build command:
1. **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
2. **Start Command**: `cd backend && npm start`

### Step 2: Secret Management
- Copy the values from your `.env` files into the **Environment Variables** section of your hosting platform.
- Ensure `NODE_ENV` is set to `production`.

---

## 3. Deployment Artifacts Created
I have added the following files to assist with your deployment:
1. `render.yaml`: For one-click deployment on Render.
2. `.gitignore`: To ensure node_modules and .env files are not accidentally committed.
3. `DEPLOYMENT_INSTRUCTIONS.md`: This file.

---

## 4. Final Checklist
- [ ] MongoDB Atlas allows connections from "0.0.0.0/0" (or your server's IP).
- [ ] Groq API Key has sufficient credits/quota.
- [ ] Frontend `dist` folder is ignored by Git, but generated during build.
