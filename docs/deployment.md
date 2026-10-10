# Deployment Guide: CampusAI Placement Portal

CampusAI is engineered for turnkey deployment across standard production cloud platforms (Vercel, Render, Railway, AWS Amplify, Docker).

---

## 1. Environment Configuration

Configure the following variables in your hosting environment:

```env
# MongoDB Connection (MongoDB Atlas or self-hosted)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/placement_portal?retryWrites=true&w=majority

# Authentication Secret
JWT_SECRET=production-grade-jwt-secret-key-32-chars-long-placement-portal
JWT_EXPIRES_IN=7d

# App Domain
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# AI Provider Configuration
AI_PROVIDER=gemini # or "openai"
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Object Storage (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 2. Deploying to Vercel (Recommended)

1. Connect your GitHub/GitLab repository to **Vercel**.
2. Set the framework preset to **Next.js**.
3. Supply the environment variables in project settings.
4. Trigger the build (`next build`).
5. Vercel automatically deploys all App Router server actions and API routes as scalable serverless functions.

---

## 3. Deploying via Docker

Create a `Dockerfile` for containerized environments:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 4. Production Health Verification

After deployment, test the health and connectivity endpoints:
1. `GET /api/auth/me` -> 401 Unauthorized (confirms endpoint security)
2. `GET /api/jobs` -> 200 OK (verifies database query resolution)
3. `POST /api/seed` -> 200 OK (initializes baseline demo datasets if needed)
