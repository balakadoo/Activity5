# BlogTown
This is a blog application where users can register, log in, and manage their blog posts. The backend uses Node.js, Express, and SQLite with Sequelize ORM for authentication and CRUD features. The frontend which uses ReactJS, lets users view, create, edit, and delete blog posts, as well as comment on posts easily.

## Tech Stack
* ReactJS
* Node.js
* Express.js
* SQLite
* Sequelize ORM
* JWT Authentication
* Bcrypt

## Features
* User authentication (Sign Up & Login)
* Create, read, update, and delete blog posts
* Comment system on posts
* Tag system for posts
* Pagination for posts
* User authorization (edit/delete own content only)
* Modern gradient UI design
* Responsive layout

## Prerequisites
* Node.js
* npm

## Instructions

### 1. Clone & Install

```
git clone <your-repository-url>
cd blog-app

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure Backend
Create `backend/.env`:

```
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production
```

### 3. Run the Application
Start Backend:

```
cd backend
npm start
```

Server runs on `http://localhost:5000`

Start Frontend:

```
cd frontend
npm start
```

App runs on `http://localhost:3000`

## API Endpoints
Base URL: `/api`

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Log in and receive a JWT token
* `GET /api/auth/me` - Get current user info

### Posts (Protected - requires JWT)
* `GET /api/posts` - Get all posts with pagination
* `GET /api/posts/:id` - Get a single post by ID
* `POST /api/posts` - Create a new post
* `PUT /api/posts/:id` - Update a specific post
* `DELETE /api/posts/:id` - Delete a specific post

### Comments (Protected - requires JWT)
* `GET /api/comments/post/:postId` - Get all comments for a post
* `POST /api/comments/post/:postId` - Create a comment
* `PUT /api/comments/:id` - Update a specific comment
* `DELETE /api/comments/:id` - Delete a specific comment

Authorization header: `Bearer <your_jwt_token>`

## Project Structure

```
blog-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── postController.js    # Post CRUD
│   │   └── commentController.js # Comment CRUD
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Post.js              # Post model
│   │   ├── Comment.js           # Comment model
│   │   └── index.js             # Associations
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── posts.js             # Post routes
│   │   └── comments.js          # Comment routes
│   └── database.sqlite          # SQLite database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   ├── pages/               # Page components
    │   ├── services/            # API service layer
    │   └── utils/               # Auth context & utilities
    └── build/                   # Production build
```

## Security
* Passwords hashed with bcrypt
* JWT-based authentication
* Protected routes with middleware
* User-specific content ownership

## Development

Backend:

```
cd backend
npm run dev
```

Frontend:

```
cd frontend
npm start
```

## Common Issues

**Port in use**: Change `PORT` in `backend/.env`

**CORS errors**: Update origin in `backend/server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Database reset**: Delete `backend/database.sqlite` and restart

**Token expired**: Login again to get a new JWT token
