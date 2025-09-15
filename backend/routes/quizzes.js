const express = require('express');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all quizzes
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      attributes: {
        exclude: ['questions'] // Exclude questions from the initial fetch
      }
    });
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz by ID (without correct answers)
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Remove correct answers from questions for the frontend
    const questionsWithoutAnswers = quiz.questions.map(q => ({
      questionText: q.questionText,
      options: q.options
    }));

    res.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: questionsWithoutAnswers,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz with correct answers (for result validation)
router.get('/:id/answers', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Only return the correct answers array
    const correctAnswers = quiz.questions.map(q => q.correctAnswer);
    
    res.json({
      quizId: quiz.id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      totalQuestions: quiz.questions.length,
      correctAnswers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;