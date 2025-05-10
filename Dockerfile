# Stage 1: Build the frontend
FROM node:16 as frontend-builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build the backend
FROM python:3.9-slim as backend
WORKDIR /app

# Install Python dependencies
COPY api/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend files
COPY api/ ./api

# Copy the built frontend files from the previous stage
COPY --from=frontend-builder /app/build ./frontend

# Stage 3: Set up Nginx
FROM nginx:alpine
WORKDIR /app

# Copy Nginx configuration
COPY api/nginx.conf /etc/nginx/nginx.conf

# Copy the backend and frontend files
COPY --from=backend /app/api /app/api
COPY --from=backend /app/frontend /usr/share/nginx/html

# Expose the port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]