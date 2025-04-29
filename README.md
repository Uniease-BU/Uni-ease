# UniEase: Digital Campus Management Platform

## Overview
UniEase is a comprehensive digital campus management platform designed to streamline essential university services. It integrates four key services—Laundry, Salon, Food Outlets, and Campus Maps—into a single, user-friendly interface. Built using the MERN stack (MongoDB, Express, React, Node.js), UniEase provides students with a seamless experience while offering administrators efficient tools for service management.

## Features
- **Laundry Management**: Submit laundry requests, track status, and view history.
- **Salon Booking**: Book appointments, manage schedules, and track status.
- **Food Ordering**: Browse menus, place orders, and track delivery status.
- **Campus Maps**: Navigate through the university with interactive maps.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication

## Project Structure
```
UniEase/
├── api/                # Backend code
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Utility scripts (e.g., seeders)
│   ├── config/         # Database configuration
│   └── server.js       # Express server
├── frontend/           # Frontend code
│   ├── src/            # React source files
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
└── README.md           # Project documentation
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas or local MongoDB instance
- Vercel CLI (for deployment)

### Backend Setup
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variable:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm start
   ```

## Deployment

### Deploying to Vercel
1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Log in to Vercel:
   ```bash
   vercel login
   ```
3. Deploy the project:
   ```bash
   vercel
   ```
4. Follow the prompts to configure the deployment.

## Seeding the Database
To seed initial data (e.g., salon slots, menu items):
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Run the seed scripts:
   ```bash
   node utils/seedSlot.js
   node utils/seedMenuItems.js
   ```

## Contributing
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.