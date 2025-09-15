import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Home, RotateCcw } from 'lucide-react';
import api from '../../services/api';

const QuizResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await api.get(`/results/${resultId}`);
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching result:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!result || !result.passed) return;

    setDownloadingCertificate(true);
    try {
      const response = await api.get(`/certificates/generate/${resultId}`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${result.Quiz.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setDownloadingCertificate(false);
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
          <p className="text-gray-600">Loading result...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Result not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Result Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {result.passed ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.passed ? 'Congratulations!' : 'Quiz Complete'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {result.passed 
                ? 'You have successfully passed the quiz!' 
                : `You need ${result.Quiz.passingScore || 70}% to pass. Keep practicing!`
              }
            </p>

            {/* Score Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{result.score}%</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{result.totalQuestions}</div>
                <div className="text-gray-600">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(result.timeSpent)}</div>
                <div className="text-gray-600">Time Spent</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {result.passed && (
                <button
                  onClick={handleDownloadCertificate}
                  disabled={downloadingCertificate}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {downloadingCertificate ? 'Generating...' : 'Download Certificate'}
                </button>
              )}
              
              <button
                onClick={() => navigate(`/quiz/${result.Quiz.id}`)}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake Quiz
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quiz Details</h3>
              <p className="text-gray-600 mb-1"><strong>Title:</strong> {result.Quiz.title}</p>
              <p className="text-gray-600 mb-1"><strong>Description:</strong> {result.Quiz.description}</p>
              <p className="text-gray-600"><strong>Passing Score:</strong> {result.Quiz.passingScore || 70}%</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Performance</h3>
              <p className="text-gray-600 mb-1"><strong>Score:</strong> {result.score}%</p>
              <p className="text-gray-600 mb-1"><strong>Correct Answers:</strong> {result.correctAnswers}/{result.totalQuestions}</p>
              <p className="text-gray-600 mb-1"><strong>Time Spent:</strong> {formatTime(result.timeSpent)}</p>
              <p className="text-gray-600"><strong>Date:</strong> {new Date(result.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;