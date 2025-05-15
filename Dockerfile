# ==============================================================================
# Stage 1: Frontend build
# ==============================================================================
FROM node:22 as frontend-builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Final image
# ==============================================================================
FROM python:3.13-alpine as backend
WORKDIR /app

# Install Nginx and Supervisor first
RUN apk update && apk add --no-cache nginx supervisor

# Install Python dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

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