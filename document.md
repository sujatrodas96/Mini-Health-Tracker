Mini-Health-Tracker
------------------------


Patient Health Tracker - Backend API

This project is a backend REST API built using Node.js, Express.js, MongoDB, and Redis. It supports secure user authentication (admin, coach, patient), patient record management, PDF report generation, and mocked WhatsApp notifications and CRM integration.


Setup Instructions

1. Clone the Repository
   Download the project by cloning the repository to your local system.

2. Install Dependencies
   Run `npm install` to install all required Node.js packages.

3. Environment Configuration
The actual .env file is not included in this repository for security reasons.

Please create your own .env file by copying the .env.example file:
PORT=5000
MONGO_URI=mongodb://localhost:27017/health_tracker
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379


Fill in the required environment variables as shown below:

4. Start the Server
   Run `npm start` to start the development server.
   The server will run on `http://localhost:1111` by default.

---

 .env.example

Below is a sample `.env` file:

* PORT=5000
* MONGO\_URI=mongodb://localhost:27017/health\_tracker
* JWT\_SECRET=your\_jwt\_secret\_key
* REDIS\_URL=redis\://localhost:6379

---

MongoDB Setup (Basic)

Option 1: Install MongoDB Locally
Download MongoDB from the official website: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
After installation, start the MongoDB server by running `mongod`.
MongoDB will be available at `mongodb://localhost:27017` by default.

Option 2: Use MongoDB Atlas (Cloud)

* Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
* Whitelist your IP address and create a database user.
* Copy the connection URI and replace it in your `.env` file under `MONGO_URI`.

---

Redis Setup (Basic)

macOS (with Homebrew):

* Run `brew install redis` to install Redis.
* Start Redis using `brew services start redis`.

Ubuntu/Debian:

* Run `sudo apt update` and `sudo apt install redis-server`.
* Enable and start the service with `sudo systemctl enable redis-server` and `sudo systemctl start redis`.

Windows:

* Download Redis for Windows from [https://github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases).
* Extract the files and run `redis-server.exe`.

Redis runs on `redis://localhost:6379` by default.
