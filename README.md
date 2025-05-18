# NotifyAgent

![Screenshot](https://i.imgur.com/IfyWMDQ.png)

## Docker-less Setup:

Start FastAPI & React:  
```bash
npm run setup
npm start
```

## Authentication System

NotifyAgent includes a secure authentication system. The first time you start the application, an admin user is automatically created:

- Username: `admin`
- Password: `admin`

**Important**: Change these credentials after your first login for security reasons.

## Docker Setup

The application can be easily started via Docker Compose using the provided `docker-compose.yml`. 

### Environment Variables

The following environment variables are optional:

- `LOG_LEVEL`: Set the logging level for the application (e.g., `info`, `debug`). Default is `info`.
- `TZ`: Set the timezone for the container. For example, `America/New_York`.
- `SECRET_KEY`: Secret key for JWT token encryption. Default is a placeholder that should be changed in production.
- `ADMIN_USERNAME`: Set the default admin username. Default is `admin`.
- `ADMIN_PASSWORD`: Set the default admin password. Default is `admin`.

### Running the Application

To start the application using Docker Compose, run:

```bash
docker-compose up
```

This will build and start the application in a single container, exposing it on port `8080`. You can access the application at `http://<your-server-ip>:8080`.

### Stopping the Application

To stop the application, run:

```bash
docker-compose down
```

### Building the Docker Image Manually

If you want to build the Docker image manually, use the following command:

```bash
docker build -t parmati/notifyagent:latest .
```

Then run the container:

```bash
docker run -p 8080:8080 parmati/notifyagent:latest
```