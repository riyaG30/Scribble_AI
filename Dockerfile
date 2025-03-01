# Use Node 18 Alpine as the base image
FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY --chown=1001:1001 package.json package-lock.json ./

# Install dependencies, omitting dev dependencies to reduce image size
#RUN npm audit fix --force
RUN npm install 


# Copy the necessary project files and directories
COPY --chown=1001:1001 app /app/app
COPY --chown=1001:1001 components /app/components
COPY --chown=1001:1001 convex /app/convex
#COPY --chown=1001:1001 .env.local /app/.env.local
COPY --chown=1001:1001 lib /app/lib
COPY --chown=1001:1001 public /app/public
COPY --chown=1001:1001 middleware.tsx /app/middleware.tsx
COPY --chown=1001:1001 tailwind.config.ts /app/tailwind.config.ts
COPY --chown=1001:1001 tsconfig.json /app/tsconfig.json
COPY --chown=1001:1001 next.config.mjs /app/next.config.mjs
COPY --chown=1001:1001 postcss.config.mjs /app/postcss.config.mjs




# Build the Next.js application
RUN npm run build


# Use a minimal runtime image
FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-18 AS runner

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app ./


# Expose the Next.js default port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
