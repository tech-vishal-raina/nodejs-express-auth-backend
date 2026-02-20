This project is a comprehensive backend API solution that demonstrates modern web development practices with a focus on security, scalability, and maintainability. It serves as a foundation for building applications that require user authentication and content management capabilities.

### Purpose

The Secure Auth & Content API provides a robust backend infrastructure for applications that need:
- **User Authentication**: Complete user registration, login, and session management
- **Email Verification**: Secure account activation through OTP-based email verification
- **Password Management**: Secure password reset functionality with expiration logic
- **Content Management**: Full CRUD operations for managing user-generated content (posts)
- **Security**: Industry-standard security practices including password hashing, JWT tokens, and secure HTTP headers

### Use Cases

This API can be used as a backend for:
- Blog platforms and content management systems
- Social media applications
- User-driven content platforms
- Any application requiring secure user authentication and content management

### Design Philosophy

The project follows a modular architecture pattern, separating concerns into distinct layers:
- **Controllers**: Handle business logic and request/response management
- **Models**: Define data structures and database schemas
- **Routers**: Manage API endpoint routing
- **Middlewares**: Provide cross-cutting concerns like authentication, validation, and email services
- **Utils**: Reusable utility functions for common operations

This structure ensures code maintainability, testability, and scalability as the application grows.

##  Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Gmail account with App Password enabled (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tech-vishal-raina/nodejs-express-auth-backend.git
   cd nodejs-express-auth-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000` (or your specified PORT).

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASS` | Gmail App Password | Yes |

### Key Features

 **Advanced Security**

Data Encryption: Passwords hashed using bcryptjs and OTPs secured via HMAC-SHA256.

Helmet Protection: Secured HTTP headers using helmet middleware.

Secure Authentication: Stateless authentication using JSON Web Tokens (JWT) stored in HTTP-only cookies.

Input Validation: Strict request payload validation using Joi schemas.

 **User Management**

Email Verification: Account activation via 6-digit OTP sent using Nodemailer (Gmail SMTP).

Password Reset Flow: Secure "Forgot Password" functionality with timed expiration logic.

Role-Based Access: Middleware to protect routes and ensure only authorized users can modify their data.

 **Content Management (CRUD)**

Post Operations: Create, Read, Update, and Delete blog posts.

Pagination: Optimized GET requests with page-based pagination for scalability.

Ownership Checks: Logic to prevent users from deleting/editing posts they didn't create.


 ### Tech Stack

Runtime Environment: Node.js

Web Framework: Express.js

Database: MongoDB (via Mongoose ODM)

Authentication: JSON Web Tokens (JWT) & Cookie-Parser

Validation: Joi

Cryptography: Bcryptjs & Node Crypto (HMAC)

Email Service: Nodemailer


 ### Project Architecture-

CRUD/

│

├── controllers/

│   ├── authController.js

│   └── postsController.js

│

├── middlewares/

│   ├── identification.js

│   ├── sendMail.js

│   └── validator.js

│

├── models/

│   ├── usersModel.js

│   └── postsModel.js

│

├── routers/

│   ├── authRouter.js

│   └── postsRouter.js

│

├── utils/

│   └── hashing.js

│

├── .env

├── .gitignore

├── index.js

├── package.json

└── package-lock.json


### API Endpoints-

 **Authentication:**

POST /api/auth/signup - Register a new user

POST /api/auth/signin - Login user

POST /api/auth/signout - Logout user

PATCH /api/auth/send-verification-code - Send OTP email

PATCH /api/auth/verify-verification-code - Verify Email OTP

PATCH /api/auth/change-password - Change password (Logged in)

PATCH /api/auth/send-forget-password-code - Send Forgot Password OTP

PATCH /api/auth/verify-forget-password-code - Reset Password


 **Posts:**

GET /api/posts/all-posts - Get all posts (Paginated)

GET /api/posts/single-post - Get specific post

POST /api/posts/create-post - Create a new post

PUT /api/posts/update-post - Update a post

DELETE /api/posts/delete-post - Delete a post


 ### Security Implementation Details

Hashing Strategy:
1. Utilized bcryptjs for password hashing with a salt round of 12. For verification codes (OTP),
   used Node's native crypto module to generate an HMAC-SHA256 hash, ensuring that even temporary codes are stored securely.

2. Authorization Middleware: Custom middleware extracts the JWT from either the Authorization header
   or Cookies, validates the signature using the secret key, and attaches the user identity to the request object.

##  Usage Examples

### Authentication Flow

1. **Sign Up**: Register a new user account
   ```bash
   POST /api/auth/signup
   Body: { "email": "user@example.com", "password": "securePassword123" }
   ```

2. **Send Verification Code**: Request email verification OTP
   ```bash
   PATCH /api/auth/send-verification-code
   Body: { "email": "user@example.com" }
   ```

3. **Verify Email**: Confirm email with OTP
   ```bash
   PATCH /api/auth/verify-verification-code
   Body: { "email": "user@example.com", "code": "123456" }
   ```

4. **Sign In**: Login and receive JWT token
   ```bash
   POST /api/auth/signin
   Body: { "email": "user@example.com", "password": "securePassword123" }
   ```

### Post Management

1. **Create Post** (requires authentication)
   ```bash
   POST /api/posts/create-post
   Headers: { "Authorization": "Bearer <token>" }
   Body: { "title": "My Post", "content": "Post content here" }
   ```

2. **Get All Posts** (with pagination)
   ```bash
   GET /api/posts/all-posts?page=1&limit=10
   ```







