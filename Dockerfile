# Stage 1: Build the web frontend
FROM node:22-bookworm-slim AS web-build
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Setup production runtime
FROM node:22-bookworm-slim AS production
WORKDIR /app

# Install production dependencies for backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend built files
COPY --from=backend-build /app/backend/dist ./dist

# Copy web built files to backend's public directory
COPY --from=web-build /app/web/dist ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/index.js"]
