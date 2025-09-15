const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('../config/database');
const Quiz = require('../models/Quiz');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const sampleQuizzes = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
    passingScore: 70,
    duration: 15,
    questions: [
      {
        questionText: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var myVar;', 'variable myVar;', 'declare myVar;', 'v myVar;'],
        correctAnswer: 0
      },
      {
        questionText: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Integer', 'Undefined'],
        correctAnswer: 2
      },
      {
        questionText: 'How do you write "Hello World" in an alert box?',
        options: ['alertBox("Hello World");', 'alert("Hello World");', 'msg("Hello World");', 'msgBox("Hello World");'],
        correctAnswer: 1
      },
      {
        questionText: 'Which operator is used to assign a value to a variable?',
        options: ['*', 'x', '=', '=='],
        correctAnswer: 2
      },
      {
        questionText: 'What will the following code return: Boolean(10 > 9)',
        options: ['true', 'false', 'NaN', 'undefined'],
        correctAnswer: 0
      }
    ]
  },
  {
    title: 'React Basics',
    description: 'Evaluate your understanding of React components, props, and state management.',
    passingScore: 75,
    duration: 20,
    questions: [
      {
        questionText: 'What is JSX?',
        options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'],
        correctAnswer: 1
      },
      {
        questionText: 'How do you create a functional component in React?',
        options: ['function Component() {}', 'class Component extends React.Component {}', 'const Component = () => {}', 'Both A and C'],
        correctAnswer: 3
      },
      {
        questionText: 'What hook is used to manage state in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1
      },
      {
        questionText: 'How do you pass data from parent to child component?',
        options: ['Props', 'State', 'Context', 'Redux'],
        correctAnswer: 0
      }
    ]
  },
  {
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of HTML, CSS, and general web development concepts.',
    passingScore: 65,
    duration: 25,
    questions: [
      {
        questionText: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'Hyper Text Making Language'],
        correctAnswer: 0
      },
      {
        questionText: 'Which CSS property is used to change the text color of an element?',
        options: ['text-color', 'color', 'font-color', 'text-style'],
        correctAnswer: 1
      },
      {
        questionText: 'What is the correct HTML element for inserting a line break?',
        options: ['<break>', '<br>', '<lb>', '<newline>'],
        correctAnswer: 1
      },
      {
        questionText: 'Which HTTP method is used to send data to a server to create/update a resource?',
        options: ['GET', 'POST', 'PUT', 'Both B and C'],
        correctAnswer: 3
      },
      {
        questionText: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 2
      },
      {
        questionText: 'Which HTML attribute is used to define inline styles?',
        options: ['class', 'style', 'styles', 'font'],
        correctAnswer: 1
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Connected to SQLite database');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Use force: true to recreate tables
    console.log('Database synchronized');

    // Insert sample quizzes
    await Quiz.bulkCreate(sampleQuizzes);
    console.log('Sample quizzes inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();