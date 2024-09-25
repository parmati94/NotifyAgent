#  NotifyAgent

![Screenshot](https://i.imgur.com/e666dmO.png)

## Docker-less Setup:

Start FastAPI & React:  
```npm run setup```, then ```npm start```

## Docker-ful Setup

The application can be easily started via Docker Compose, use the provided docker-compose.yml.  Make sure to either fill in the placeholders manually, or set the intended values as environment variables on your machine prior to running docker-compose up.

Here are the environment variables you need to set:

- `API_HOST`: This should be the IP address of the machine where the API service will run. For example, `192.168.1.2`.

- `FRONTEND_HOST`: This should be the IP address of the machine where the frontend service will run. For example, `192.168.1.2`.

- `FRONTEND_PORT`: This is the port on your host machine that you want to use to access the frontend service. You can choose any port that is not being used by another service. For example, `3001`.

- `API_PORT`: This is the port on your host machine that you want to use to access the API service. You can choose any port that is not being used by another service. For example, `8001`. 

```