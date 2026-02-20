🛡️ Secure Auth & Content API

A production-ready RESTful Backend API built with Node.js, Express, and MongoDB. This project implements a full-featured Authentication system including Email Verification (OTP), Password Recovery, and secure Session Management using JWT, alongside a complete CRUD system for Post management.

✨ Key Features

🔐 Advanced Security

Data Encryption: Passwords hashed using bcryptjs and OTPs secured via HMAC-SHA256.

Helmet Protection: Secured HTTP headers using helmet middleware.

Secure Authentication: Stateless authentication using JSON Web Tokens (JWT) stored in HTTP-only cookies.

Input Validation: Strict request payload validation using Joi schemas.

👤 User Management

Email Verification: Account activation via 6-digit OTP sent using Nodemailer (Gmail SMTP).

Password Reset Flow: Secure "Forgot Password" functionality with timed expiration logic.

Role-Based Access: Middleware to protect routes and ensure only authorized users can modify their data.

📝 Content Management (CRUD)

Post Operations: Create, Read, Update, and Delete blog posts.

Pagination: Optimized GET requests with page-based pagination for scalability.

Ownership Checks: Logic to prevent users from deleting/editing posts they didn't create.










🛠️ Tech Stack

Runtime Environment: Node.js

Web Framework: Express.js

Database: MongoDB (via Mongoose ODM)

Authentication: JSON Web Tokens (JWT) & Cookie-Parser

Validation: Joi

Cryptography: Bcryptjs & Node Crypto (HMAC)

Email Service: Nodemailer



📂 Project Architecture-

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




📡 API Endpoints-

🟢 Authentication:

POST /api/auth/signup - Register a new user

POST /api/auth/signin - Login user

POST /api/auth/signout - Logout user

PATCH /api/auth/send-verification-code - Send OTP email

PATCH /api/auth/verify-verification-code - Verify Email OTP

PATCH /api/auth/change-password - Change password (Logged in)

PATCH /api/auth/send-forget-password-code - Send Forgot Password OTP

PATCH /api/auth/verify-forget-password-code - Reset Password


🟢 Posts:

GET /api/posts/all-posts - Get all posts (Paginated)

GET /api/posts/single-post - Get specific post

POST /api/posts/create-post - Create a new post

PUT /api/posts/update-post - Update a post

DELETE /api/posts/delete-post - Delete a post


🛡️ Security Implementation Details

Hashing Strategy:
1. Utilized bcryptjs for password hashing with a salt round of 12. For verification codes (OTP),
   used Node's native crypto module to generate an HMAC-SHA256 hash, ensuring that even temporary codes are stored securely.

2. Authorization Middleware: Custom middleware extracts the JWT from either the Authorization header
   or Cookies, validates the signature using the secret key, and attaches the user identity to the request object.









