# Project HARIBON Chatbot

A FastAPI-based webhook service that integrates with **Facebook Messenger** to receive and handle **rescue requests** for **Project HARIBON** — a disaster response platform.

## 🛠 Requirements

-   Python 3.10+
-   [uv](https://github.com/astral-sh/uv)

## Getting Started

### 1. Install Dependencies

Use [uv](https://github.com/astral-sh/uv), a fast Python package manager:

```bash
uv sync
```

### 2. Activate Virtual Environment

```bash
source .venv/bin/activate
```

### 3. Configure Environment Variables

Copy the example `.env` file and fill in your values:

```bash
cp .env.example .env
```

### 4. Create log directory

```bash
./scripts/init.sh
```

### 4. Run the Application

```bash
uv run uvicorn app.main:app --host localhost --port 3000 --log-config logconf.yaml
```

### 5. Use ngrok for SSL

Facebook requires a public HTTPS endpoint for webhook validation.

Start ngrok to expose your local FastAPI app:

```bash
ngrok http --url <ngrok-url> 3000
```

## Running with Docker

If you prefer to run the app inside a Docker container:

### 1. Build the image

```bash
docker build -t haribon-chatbot .
```

### 2. Run the container

```bash
docker run -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  haribon-chatbot
```

### 3. Use ngrok for SSL
