# NotifyAgent

![Screenshot](https://i.imgur.com/e666dmO.png)

## Docker-less Setup:

Start FastAPI & React:  
```bash
npm run setup
npm start
```

## Docker Setup

The application can be easily started via Docker Compose using the provided `docker-compose.yml`. 

### Environment Variables

The following environment variables are optional:

- `LOG_LEVEL`: Set the logging level for the application (e.g., `info`, `debug`). Default is `info`.
- `TZ`: Set the timezone for the container. For example, `America/New_York`.

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