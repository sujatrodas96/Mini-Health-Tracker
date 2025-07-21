# Mini-Health-Tracker


# Patient Health Tracker - Backend API

This is a secure, modular backend REST API built using Node.js, Express.js, MongoDB, and Redis. It supports role-based authentication (admin, coach, patient), patient record management with file uploads (image + PDF), simulated WhatsApp message queuing, and mocked CRM integration.

---

## How to Run the Project

### 1. Clone the Repository
Clone the project to your local machine:

git clone https://github.com/your-username/patient-health-tracker.git
cd patient-health-tracker


### 2. Install Dependencies
Use npm to install all project dependencies:
npm install


### 3. Environment Configuration

- The `.env` file is **not included** in this repository for security reasons.

### 4. Start MongoDB and Redis

Ensure you have both MongoDB and Redis running locally:

- MongoDB default: `mongodb://localhost:27017`
- Redis default: `redis://localhost:6379`

### 5. Start the Development Server

npm start


The server will be accessible at `http://localhost:1111`.

---

## Environment Variables

These are the required environment variables. Create them in your `.env` file using `.env.example` as a reference:

PORT=1111
MONGO_URI=mongodb://localhost:27017/health_tracker
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379

---

## MongoDB Setup (Basic)

### Option 1: Local MongoDB

- Download from: https://www.mongodb.com/try/download/community
- Start the server using: `mongod`

### Option 2: MongoDB Atlas (Cloud)

- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a cluster, get your connection URI, and update `MONGO_URI` in `.env`

---

## Redis Setup (Basic)

### macOS (Homebrew)

brew install redis
brew services start redis


### Ubuntu/Debian

sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis



### Windows

- Download from: https://github.com/microsoftarchive/redis/releases
- Extract and run `redis-server.exe`

---

## Postman Collection

You can test all API endpoints using the public Postman collection below:

 [Click to open Postman Collection](https://postman.co/workspace/testapi~f405e1b1-bdf6-40e8-845f-ad9fa7b6df28/collection/27276053-d3574430-ece0-4d42-b857-8e989c2c3ed0?action=share&creator=27276053)

---

##  Sample API Requests

### Login

**POST** `/api/auth/login`  
Request Body:
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}


curl -X POST http://localhost:1111/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@example.com","password":"yourpassword"}'


Create a Patient (Admin/Coach only)
POST /api/patients
Headers:
Authorization: Bearer <your_token>

Form Data:

name: John Doe

age: 30

weight: 75

fat: 20

profileImage: (image file)

report: (PDF file)


*** Get All Patients ***

GET /api/patients
Headers:
Authorization: Bearer <your_token>

Security
JWT-based authentication

Role-based access control for Admin, Coach, and Patient users

File upload restrictions

Project Structure (Overview)

controllers/ – Route logic

DB/ - Database Cinnection 

routes/ – API routes

models/ – Mongoose schemas

middleware/ – Auth and error handlers

utils/ – CRM, WhatsApp simulation and Redis queue jobs

uploads/ – Uploaded images

logs/ – Request and error logs


License
This project is open for learning and testing purposes.