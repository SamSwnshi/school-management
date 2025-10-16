# School Management API

A minimal Node.js + Express + MySQL API to manage schools and query nearest schools using the Haversine formula for distance.

## Features
- Add a school with validated name, address, latitude, and longitude
- List schools ordered by distance from a user-provided coordinate
- Robust input validation and centralized error handling

## Tech Stack
- Node.js, Express
- MySQL (via `mysql2/promise` with SSL support)
- Environment config via `dotenv`
- SSL/TLS support for cloud databases

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

**For Local MySQL:**
```bash
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

**For Cloud MySQL (Aiven, AWS RDS, etc.):**
```bash
PORT=8080
DB_HOST=your-cloud-host.com
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_SSL_CA=path/to/ca-certificate.pem
```

### 3) Database schema
Create the database and the `schools` table. Example SQL:
```sql
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Note:** The app includes SSL support for cloud databases and validates latitude in [-90, 90] and longitude in [-180, 180]. Distances are computed in kilometers via the Haversine formula in SQL.

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

## Troubleshooting

### Database Connection Issues

**Common Error: `connect ETIMEDOUT`**
- **Local MySQL**: Ensure MySQL service is running (`net start mysql` on Windows)
- **Cloud MySQL**: Check if your cloud service is active (not paused)
- **SSL Issues**: Verify SSL certificate path in `DB_SSL_CA` environment variable
- **Firewall**: Ensure port 3306 is accessible

**Common Error: `Access denied for user`**
- Verify username and password in `.env` file
- Check if user has proper permissions
- For cloud databases, ensure user exists and has database access

### Testing Database Connection
You can test your database connection by running:
```bash
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();
mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL_CA ? { ca: require('fs').readFileSync(process.env.DB_SSL_CA) } : false
}).then(() => console.log('✅ Connection successful')).catch(console.error);
"
```

## Error Handling
A global error handler returns consistent JSON on unexpected errors and logs stack traces to the server console.

## License
ISC
