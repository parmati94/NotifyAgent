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

# Install Nginx and Supervisor first
RUN apt-get update && apt-get install -y nginx supervisor && apt-get clean

# Install Python dependencies
COPY api/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend files
COPY api/ ./api

# Clear the default Nginx HTML directory
RUN rm -rf /usr/share/nginx/html/*

# Copy the built frontend files from the previous stage
COPY --from=frontend-builder /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY api/nginx.conf /etc/nginx/nginx.conf

# Create Supervisor configuration
COPY api/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the port
EXPOSE 8080

# Start Supervisor to manage both FastAPI and Nginx
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]