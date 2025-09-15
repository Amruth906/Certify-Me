# Micro-Certification Platform

A full-stack web application for taking quizzes and earning certificates. Built with React frontend, Node.js/Express backend, and MongoDB database.

## 🌟 Features

### Frontend (React)
- **User Authentication**: Complete registration and login system
- **Quiz Interface**: Question-by-question navigation with timer
- **Result Screen**: Instant score display with pass/fail status
- **Certificate Generation**: Download PDF certificates for passed quizzes
- **Dashboard**: Personal analytics and quiz history
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend (Node.js + Express)
- **RESTful APIs**: Complete CRUD operations for all entities
- **Authentication**: JWT-based secure authentication
- **Quiz Management**: Fetch questions and validate answers
- **Result Calculation**: Server-side score computation
- **Certificate Generation**: PDF generation using Puppeteer
- **Data Validation**: Input validation and error handling

### Database (MongoDB)
- **Users**: id, name, email, password (hashed)
- **Quizzes**: id, title, description, questions[], passingScore, duration
- **Questions**: id, questionText, options[], correctAnswer
- **Results**: id, userId, quizId, answers[], score, passed, date

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd micro-certification-platform
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/certification_platform
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure_and_long
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

5. **Seed the database with sample quizzes**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 5173).

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
micro-certification-platform/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── scripts/            # Database seeding scripts
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main App component
│   └── public/             # Static assets
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID (without answers)
- `GET /api/quizzes/:id/answers` - Get quiz with correct answers

### Results
- `POST /api/results/submit` - Submit quiz answers
- `GET /api/results/user` - Get user's quiz results
- `GET /api/results/:id` - Get specific result

### Certificates
- `GET /api/certificates/generate/:resultId` - Generate and download certificate PDF

## 🎯 Usage Flow

1. **Registration/Login**: Users create an account or log in
2. **Browse Quizzes**: View available quizzes with details
3. **Take Quiz**: Answer questions one by one with timer
4. **View Results**: See instant score and pass/fail status
5. **Download Certificate**: Get PDF certificate for passed quizzes
6. **Track History**: View all quiz attempts and results

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite development server
```

### Database Seeding
```bash
cd backend
npm run seed  # Populate database with sample quizzes
```

## 🚀 Deployment

### Backend Deployment (Vercel)
1. Create `vercel.json` in backend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

2. Deploy backend:
   ```bash
   cd backend
   vercel --prod
   ```

### Frontend Deployment (Vercel)
1. Update API base URL in `frontend/src/services/api.js`
2. Deploy frontend:
   ```bash
   cd frontend
   vercel --prod
   ```

### Environment Variables for Production
Set these in your Vercel dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secure JWT secret key
- `NODE_ENV`: production

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation using express-validator
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: Number
  }],
  passingScore: Number,
  duration: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Results Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  quizId: ObjectId (ref: Quiz),
  answers: [Number],
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  passed: Boolean,
  timeSpent: Number,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Interactive Elements**: Smooth transitions and hover effects
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Clear error messages and validation

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Quiz browsing and selection
- [ ] Question navigation and answering
- [ ] Timer functionality
- [ ] Score calculation and results display
- [ ] Certificate generation and download
- [ ] Quiz history and analytics

## 📈 Performance Optimizations

- **Code Splitting**: React lazy loading for optimal bundle size
- **API Optimization**: Efficient database queries with MongoDB
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the API documentation
- Review the demo application

---

**Built with ❤️ by a learner using React, Node.js, Express, and MongoDB**