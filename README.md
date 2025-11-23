# MeConnect

A modern professional networking platform built with the MERN stack, enabling users to connect, share posts, and grow their professional network.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Professional Profiles**: Create and customize your professional profile
- **Post Management**: Create, view, and interact with posts
- **Networking**: Send and manage connection requests
- **Real-time Notifications**: Stay updated with connection requests and interactions
- **Responsive Design**: Modern UI built with React and DaisyUI/Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload and storage
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
MeConnect/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── lib/            # Utilities (DB, Cloudinary)
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── lib/        # Axios configuration
│   │   └── utils/      # Helper functions
│   └── public/         # Static assets
└── package.json        # Root dependencies
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MeConnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd frontend && npm install
   cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Running the Application

#### Development Mode

**Backend:**

```bash
npm run dev
```

Server runs on `http://localhost:5000`

**Frontend:**

```bash
cd frontend
npm run dev
```

Client runs on `http://localhost:5173`

#### Production Build

```bash
npm run build
npm start
```

## 🔧 API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Users

- `GET /api/v1/users/:username` - Get user profile
- `PUT /api/v1/users/profile` - Update profile

### Posts

- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post
- `DELETE /api/v1/posts/:id` - Delete post
- `GET /api/v1/posts/:id` - Get single post

### Connections

- `POST /api/v1/connections/request/:userId` - Send connection request
- `PUT /api/v1/connections/accept/:requestId` - Accept request
- `PUT /api/v1/connections/reject/:requestId` - Reject request
- `GET /api/v1/connections/requests` - Get pending requests
- `GET /api/v1/connections` - Get user connections

### Notifications

- `GET /api/v1/notifications` - Get all notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `DELETE /api/v1/notifications/:id` - Delete notification

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Mohamed Ramadan**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using the MERN stack
