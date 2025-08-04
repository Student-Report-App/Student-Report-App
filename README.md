# Student Report App

The Student Report App is a user-friendly platform designed to help students track their academic performance efficiently. With this app, students can easily access and view their grades, test scores, and progress over time.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Docker Setup (Recommended)](#option-1-docker-setup-recommended)
  - [Local Development Setup](#option-2-local-development-setup)
- [Docker Commands](#docker-commands)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- User authentication (login, logout, register)
- Profile management
- Timetable viewing
- Library resources
- Announcements
- Password hashing for security

---

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Argon2 (for password hashing)

### Frontend

- HTML, CSS, JavaScript

### DevOps & Deployment

- Docker
- Docker Compose

---

## Installation

You can run this application in two ways: using Docker (recommended) or setting up a local development environment.

### Option 1: Docker Setup (Recommended)

Docker makes it easy to run the application with all dependencies included.

#### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

#### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Student-Report-App/Student-Report-App.git
   cd Student-Report-App
   ```

2. **Create environment file**:

   ```bash
   cp sample.env .env
   ```

3. **Configure environment variables** in the `.env` file:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://db:27017/student-report-app
   ```

4. **Build and run with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   Or run in detached mode:

   ```bash
   docker-compose up -d --build
   ```

5. **Access the application**:
   Open your browser and navigate to http://localhost:3000

6. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

If you prefer to run the application locally without Docker:

#### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally

#### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Student-Report-App/Student-Report-App.git
   cd Student-Report-App
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create environment file**:

   ```bash
   cp sample.env .env
   ```

4. **Configure environment variables** in the `.env` file:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/student-report-app
   ```

5. **Start MongoDB server** (if using local instance)

6. **Start the application**:

   ```bash
   npm start
   ```

7. **Access the application**:
   Open your browser and navigate to http://localhost:3000

## Usage

### User Authentication

- **Register**: Navigate to the register page and fill in the required details to create a new account.
- **Login**: Use your username/email and password to log in.
- **Logout**: Click the logout button to end your session.

### Profile Management

- **View Profile**: Navigate to the profile page to view your profile information.
- **Update Profile**: Edit your profile details and save the changes.

### Timetable

- **View Timetable**: Navigate to the timetable page to view your class schedule.

### Library

- **View Library Resources**: Navigate to the library page to view available books and resources.

### Announcements

- **View Announcements**: Check the dashboard for the latest announcements.

---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
