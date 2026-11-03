Swiggy - Backend

A backend-only food ordering platform built using Node.js, Express.js, MongoDB, and Mongoose.

Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs
- Joi Validation

Features

- User Authentication
- Access & Refresh Tokens
- Role-Based Access Control
- Restaurant Management
- Food & Category Management
- Cart Management
- Order Management
- Search & Filtering
- Admin Management
- Ownership Validation

Installation

npm install

Environment Variables

Create a ".env" file in the root directory:

PORT=5000
NODE_ENV=development

MONGO_URL=your_mongodb_atlas_url

JWT_ACCESS_SECRET=swiggy_access_secret
JWT_REFRESH_SECRET=swiggy_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

ADMIN_SECRET_KEY=swiggy_admin_secret
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_admin_password

CLIENT_URL=http://localhost:5173

Create Admin
npm run seed:admin

Run Project
npm run dev

Server: "http://localhost:5000"
