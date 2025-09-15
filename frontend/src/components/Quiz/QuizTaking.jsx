import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isSubmitting, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      const quizData = response.data;
      setQuiz(quizData);
      setAnswers(new Array(quizData.questions.length).fill(-1));
      setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Error fetching quiz:', error);
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const timeSpent = (quiz.duration * 60) - timeLeft;
      const response = await api.post('/results/submit', {
        quizId: quiz.id,
        answers,
        timeSpent
      });

      navigate(`/result/${response.data.result.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Quiz not found</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const answeredQuestions = answers.filter(answer => answer !== -1).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-lg font-semibold text-blue-600">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>{answeredQuestions} of {quiz.questions.length} questions answered</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900">{option}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;