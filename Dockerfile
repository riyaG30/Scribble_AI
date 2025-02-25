# Use Node 18 Alpine as the base image
FROM --platform=linux/arm64 node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies, omitting dev dependencies to reduce image size
#RUN npm audit fix --force
RUN npm install 
RUN npm fund

# Copy the necessary project files and directories
COPY app /app/app
COPY components /app/components
COPY convex /app/convex
COPY .env.local /app/.env.local
COPY lib /app/lib
COPY public /app/public
COPY middleware.tsx /app/middleware.tsx
COPY tailwind.config.ts /app/tailwind.config.ts
COPY tsconfig.json /app/tsconfig.json
COPY next.config.mjs /app/next.config.mjs
COPY postcss.config.mjs /app/postcss.config.mjs
ENV KINDE_CLIENT_ID=4627db1c9d2c459eb99522bb863285ed
ENV KINDE_CLIENT_SECRET=VKqG9fHGTaPaNGLH5BYnHOusNwETXpCdpmyZdnxXk1tNGnhGvZ2W
ENV KINDE_ISSUER_URL=https://riyagupta.kinde.com
ENV KINDE_SITE_URL=http://localhost:3000=value
ENV KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
ENV KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
ENV CONVEX_DEPLOYMENT=dev:glad-fish-700 
ENV NEXT_PUBLIC_CONVEX_URL=https://glad-fish-700.convex.cloud
ENV GENERATE_TEXT_API=1tCTLW0VivxpdKUzb03KdCGc5P9f5NN5PoEk5CywVfaf


# Build the Next.js application
RUN npm run build

# Use a minimal runtime image
FROM --platform=linux/arm64 node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app ./

# Expose the Next.js default port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
