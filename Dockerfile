# Stage 1: Build the UI
FROM node:20 as build-ui
WORKDIR /usr/src/app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# Stage 2: Build the API
FROM python:3.8-slim-buster as build-api
WORKDIR /app

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Install dependencies:
COPY api/requirements.txt ./api/
RUN pip install -r api/requirements.txt

# Copy python files:
COPY api ./api

# Copy the built UI from the previous stage
COPY --from=build-ui /usr/src/app/client/build /app/api/static

# Final stage: Run both API and UI using Nginx
FROM python:3.8-slim-buster
WORKDIR /app

# Install Node.js 20, npm, and Nginx
RUN apt-get update && apt-get install -y curl nginx \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install a specific version of serve
RUN npm install -g serve@14.1.2

# Copy the API and UI from the build stages
COPY --from=build-api /app /app

# Install dependencies again (if needed)
RUN pip install -r api/requirements.txt

# Copy set-env.js
COPY client/set-env.js /app/api/static/
RUN chmod +x /app/api/static/set-env.js

# Ensure env-config.js exists
COPY client/public/env-config.js /app/api/static/public/env-config.js

# Ensure the database directory exists and is writable
RUN mkdir -p /app/api/config && chmod -R 777 /app/api/config

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8181
EXPOSE 8181

# Run both the API and the UI server using Nginx
CMD ["/bin/bash", "-c", "node /app/api/static/set-env.js && uvicorn api.api.main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
