import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Award, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Quizzes</h1>
        <p className="text-gray-600">Choose a quiz to test your knowledge and earn a certificate</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{quiz.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{quiz.totalQuestions} Questions</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{quiz.duration} Minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  <span>Passing Score: {quiz.passingScore}%</span>
                </div>
              </div>

              <Link
                to={`/quiz/${quiz.id}`}
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Start Quiz
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Available</h3>
          <p className="text-gray-600">Check back later for new quizzes!</p>
        </div>
      )}
    </div>
  );
};

export default QuizList;