import React, { useState, useEffect } from 'react';
import { Award, Clock, BookOpen, Download, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const QuizHistory = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results/user');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (resultId, quizTitle) => {
    try {
      const response = await api.get(`/certificates/generate/${resultId}`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${quizTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz History</h1>
        <p className="text-gray-600">Track your progress and download certificates for passed quizzes</p>
      </div>

      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{result.Quiz.title}</h3>
                      <p className="text-gray-600 text-sm">{result.Quiz.description}</p>
                    </div>
                    <div className="flex items-center ml-4">
                      {result.passed ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{result.correctAnswers}</div>
                      <div className="text-xs text-gray-600">Correct</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatTime(result.timeSpent)}</div>
                      <div className="text-xs text-gray-600">Duration</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.passed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Status</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(result.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {result.totalQuestions} questions
                      </span>
                    </div>

                    {result.passed && (
                      <button
                        onClick={() => handleDownloadCertificate(result.id, result.Quiz.title)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz History</h3>
          <p className="text-gray-600 mb-6">You haven't taken any quizzes yet. Start your learning journey!</p>
          <a
            href="/quizzes"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse Quizzes
          </a>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;