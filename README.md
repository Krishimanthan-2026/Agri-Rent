# Agri-Rent: Farm Equipment Rental Platform

## Overview

Agri-Rent is a location-based web platform designed to connect farmers with nearby agricultural equipment owners. It enables farmers to discover, book, and schedule farm machinery such as tractors, ploughs, rotavators, and other equipment, reducing the financial burden of purchasing costly machinery.

The platform also allows equipment owners to list their machinery and earn additional income by renting them out when not in use.

---

## Problem Statement

Many farmers face difficulty accessing modern agricultural equipment due to high purchase costs. At the same time, equipment owners often have idle machinery that remains underutilized.

Agri-Rent bridges this gap by providing a shared platform where:

* Farmers can rent equipment as needed
* Owners can maximize equipment usage and generate income

---

## Features

* Location-based equipment discovery
* Equipment booking and availability tracking
* Owner and renter dashboards
* Admin panel to monitor users and transactions
* Notification system for unavailable equipment
* Multi-language support for better accessibility
* Interactive map integration for nearby equipment search
* AI-based assistance for user queries

---

## Technology Stack

### Frontend

* React.js (Vite)
* HTML5
* CSS3
* JavaScript

## Backend

The backend of Agri-Rent is responsible for handling business logic, managing user authentication, processing bookings, and coordinating communication between the frontend and database.

### Responsibilities

* User authentication (Admin, Owner, Renter)
* Equipment listing and management
* Booking and availability control
* Notification handling for unavailable equipment
* Admin monitoring and data management

### Suggested Technologies

* Node.js
* Express.js

---

## Database

The database is used to store and manage all application data including users, equipment, bookings, and notifications.

### Data Entities

* Users (Admin, Owners, Renters)
* Equipment details (name, type, availability, pricing)
* Bookings (date, time, user, equipment)
* Notifications (availability alerts)

### Suggested Database Options

* MongoDB (NoSQL, flexible schema)

---

## API Design

The backend exposes RESTful APIs to interact with the frontend application.

### Example Endpoints

#### Authentication

* POST /api/auth/register
* POST /api/auth/login

#### Equipment

* GET /api/equipment
* POST /api/equipment
* PUT /api/equipment/:id
* DELETE /api/equipment/:id

#### Booking

* POST /api/book
* GET /api/bookings

#### Notifications

* POST /api/notify
* GET /api/notifications

---

## API Keys and Environment Variables

Sensitive data such as API keys and configuration settings should not be stored directly in the source code. Instead, use environment variables.

### Example (.env file)

PORT=5000
MONGO_URI=your_database_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key

### Important Notes

* Do not upload the .env file to GitHub
* Add .env to .gitignore
* Keep API keys secure and private

---

## Integration

The frontend communicates with the backend using HTTP requests (REST APIs). The backend processes these requests, interacts with the database, and returns appropriate responses.


### Libraries and Tools

* React Router DOM (routing)
* Leaflet (maps integration)

### Development Tools

* Git and GitHub (version control)
* VS Code (development environment)

---

## Project Structure

```
Agri-Rent/
│
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable components
│   ├── pages/             # Application pages
│   ├── context/           # State management (Context API)
│   ├── assets/            # Images and icons
│   └── main.jsx           # Entry point
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation and Setup

1. Clone the repository:
   git clone https://github.com/Krishimanthan-2026/Agri-Rent.git

2. Navigate to the project directory:
   cd Agri-Rent

3. Install dependencies:
   npm install

4. Run the development server:
   npm run dev

5. Open in browser:
   http://localhost:5173/

---

## Usage

* Farmers can search and rent nearby equipment
* Equipment owners can list and manage their machinery
* Admin can monitor all activities and users

---

## Future Enhancements

* Online payment integration
* Real-time equipment tracking
* Mobile application support
* Advanced AI recommendations
* Review and rating system

---

## License

This project is developed for educational and demonstration purposes.
