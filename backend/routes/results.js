const express = require('express');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Submit quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;

    // Get quiz with correct answers
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save result
    const result = await Result.create({
      userId: req.user.id,
      quizId,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      passed,
      timeSpent
    });

    // Populate user and quiz data for response
    const populatedResult = await Result.findByPk(result.id, {
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: Quiz, attributes: ['title', 'description', 'passingScore'] },
      ],
    });

    res.status(201).json({
      result: {
        id: populatedResult.id,
        score: populatedResult.score,
        correctAnswers: populatedResult.correctAnswers,
        totalQuestions: populatedResult.totalQuestions,
        passed: populatedResult.passed,
        timeSpent: populatedResult.timeSpent,
        date: populatedResult.createdAt,
        quiz: {
          id: populatedResult.Quiz.id,
          title: populatedResult.Quiz.title,
          passingScore: populatedResult.Quiz.passingScore
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's quiz results
router.get('/user', auth, async (req, res) => {
  try {
    const results = await Result.findAll({
      where: { userId: req.user.id },
      include: [{ model: Quiz, attributes: ['title', 'description'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific result by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [{ model: Quiz, attributes: ['title', 'description', 'questions'] }],
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;