# School Management API

A minimal Node.js + Express + MySQL API to manage schools and query nearest schools using the Haversine formula for distance.

## Features
- Add a school with validated name, address, latitude, and longitude
- List schools ordered by distance from a user-provided coordinate
- Robust input validation and centralized error handling

## Tech Stack
- Node.js, Express
- MySQL (via `mysql2/promise`)
- Environment config via `dotenv`

## Prerequisites
- Node.js 18+
- MySQL 8+ (or compatible)

## Getting Started

### 1) Clone and install
```bash
git clone https://github.com/SamSwnshi/school-management.git
cd school-management
npm install
```

### 2) Environment variables
Create a `.env` file in the project root with your database credentials and server port:
```bash
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_db
```

### 3) Database schema
Create the database and the `schools` table. Example SQL:
```sql
CREATE DATABASE IF NOT EXISTS school_db 
USE school_db;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The app validates latitude in [-90, 90] and longitude in [-180, 180]. Distances are computed in kilometers via the Haversine formula in SQL.

### 4) Run the server
```bash
npm start
```
By default the API listens on `http://localhost:${PORT}` (defaults to 8080).

## API Reference
Base URL: `http://localhost:8080/api`

### Add a school
- Method: `POST`
- Path: `/addSchool`
- Body (JSON):
```json
{
  "name": "Springfield Elementary",
  "address": "742 Evergreen Terrace, Springfield",
  "latitude": 40.73061,
  "longitude": -73.935242
}
```
- Success (201):
```json
{
  "success": true,
  "message": "School added successfully.",
  "school": {
    "id": 1,
    "name": "Springfield Elementary",
    "address": "742 Evergreen Terrace, Springfield"
  }
}
```
- Validation errors (400) and server errors (500) return a JSON with `success: false` and a message.

cURL example:
```bash
curl -X POST http://localhost:8080/api/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Springfield Elementary",
    "address": "742 Evergreen Terrace, Springfield",
    "latitude": 40.73061,
    "longitude": -73.935242
  }'
```

### List schools by distance
- Method: `GET`
- Path: `/schoolList`
- Query params:
  - `lat` (number, required) — user latitude in [-90, 90]
  - `long` (number, required) — user longitude in [-180, 180]
- Success (200):
```json
{
  "success": true,
  "total_schools": 2,
  "userLocation": { "lat": 40.73, "lng": -73.93 },
  "schools": [
    {
      "id": 5,
      "name": "Springfield Elementary",
      "address": "742 Evergreen Terrace, Springfield",
      "latitude": 40.73061,
      "longitude": -73.935242,
      "distance_km": 0.42
    }
  ]
}
```
- Validation errors (400) and server errors (500) return a JSON with `success: false` and a message.

cURL example:
```bash
curl "http://localhost:8080/api/schoolList?lat=40.73061&long=-73.935242"
```

## Project Structure
```
.
├─ db/
│  └─ db.js           # MySQL pool + connection check
├─ routes/
│  └─ school.routes.js# /api endpoints
├─ index.js           # Express app entrypoint
├─ package.json
└─ README.md
```

## Scripts
- `npm start` — start server with Node (`index.js`)

Tip: If you prefer auto-restart during development, install nodemon globally or add a `dev` script locally, then run it instead of `npm start`.

## Error Handling
A global error handler returns consistent JSON on unexpected errors and logs stack traces to the server console.

## License
ISC
