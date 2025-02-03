# User Management API

This is a RESTful API for user management built with Node.js, Express, TypeORM, and MySQL.

## Features
- User registration and login with JWT authentication
- User verification system
- CRUD operations for users
- Statistics on registered and verified users
- Filtering, sorting, and pagination support


## Installation
1. Clone the repository:
   
   \`\`\`
   git clone https://github.com/abdelrahman-2513/nodejs-challenge.git
   cd user-management-api
   \`\`\`

2. Install dependencies:
   
   \`\`\`
   npm install
   \`\`\`

3. Set up the environment variables:
   
   Create a **.env** file and add:
   
   \`\`\`
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=password
   DB_NAME=user_management
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=1h
   \`\`\`

4. Start the server:
   
   \`\`\`
   npm run dev
   \`\`\`

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | User login |
| GET | /api/users | Get all users (Admin only) |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user (Admin only) |
| GET | /api/stats/total-users | Get total registered users |
| GET | /api/stats/total-verified-users | Get total verified users |

