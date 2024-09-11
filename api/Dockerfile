# Dockerfile

FROM python:3.8-slim-buster
WORKDIR /app

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy python files:
COPY . api/

# Run the application:
CMD ["uvicorn", "api.api.main:app", "--host", "0.0.0.0", "--port", "8000"]