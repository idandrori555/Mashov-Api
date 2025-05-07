# 🎓 Mashov API
A modern REST API wrapper for the Mashov school management system, built with Deno and Express.

## 📋 Features
- ✨ REST API endpoints for Mashov functionality
- 📊 Grade retrieval and statistics
- 📅 Attendance tracking and absence reporting
- 🔒 Secure session management
- 🌐 Web interface for testing

## 🛠️ Tech Stack
- Deno
- Express
- TypeScript
- Docker

## 🚀 Getting Started

### Prerequisites
- [Deno](https://deno.land/) installed
- [Docker](https://www.docker.com/) (optional)
- Your school's Semel ID (find it at `https://web.mashov.info/api/schools`)

### Local Development
1. Clone the repository
```bash
git clone https://github.com/idandrori555/Mashov-Api.git
cd Mashov-Api
```

2. Install dependencies and run
```bash
# Development mode with watch
deno task dev

# Production mode
deno task prod
```

### 🐳 Docker Deployment

1. Build the Docker image
```bash
docker build -t mashov-api .
```

2. Run the container
```bash
docker run -p 3000:3000 mashov-api
```

## 🔌 API Endpoints

### Authentication
```http
POST /login
Content-Type: application/json

{
    "semel": "your_school_id",
    "year": "current_year",
    "username": "your_username",
    "password": "your_password"
}
```

### Endpoints (Require Authentication)
- `GET /grades/:sessionId` - Retrieve grades
- `GET /absences/:sessionId` - Get absence summary
- `GET /behaviour/:sessionId` - Get behavior records
- `GET /lessons/:sessionId/:groupId` - Get lesson history

## 💻 Web Interface
Access the web interface at `http://localhost:3000` after starting the server.

## ⭐ Show your support
Give a ⭐️ if this project helped you!

## 📝 Notes
- Make sure to keep your credentials secure
- The API is intended for educational purposes
- Rate limiting may apply on Mashov's servers