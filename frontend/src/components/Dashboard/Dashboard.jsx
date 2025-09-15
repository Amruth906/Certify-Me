import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    passedAttempts: 0,
    averageScore: 0,
  });
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quizzesResponse, resultsResponse] = await Promise.all([
        api.get("/quizzes"),
        api.get("/results/user"),
      ]);

      const quizzes = quizzesResponse.data;
      const results = resultsResponse.data;

      const passedResults = results.filter((result) => result.passed);
      const averageScore =
        results.length > 0
          ? Math.round(
              results.reduce((sum, result) => sum + result.score, 0) /
                results.length
            )
          : 0;

      setStats({
        totalQuizzes: quizzes.length,
        totalAttempts: results.length,
        passedAttempts: passedResults.length,
        averageScore,
      });

      setRecentResults(results.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">
          Ready to continue your learning journey? Take a quiz and earn your
          certification.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Available Quizzes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalQuizzes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Certificates Earned
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.passedAttempts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Attempts
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalAttempts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Link
              to="/quizzes"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <BookOpen className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Browse Quizzes</h3>
                <p className="text-sm text-gray-600">
                  Explore available quizzes and start learning
                </p>
              </div>
            </Link>

            <Link
              to="/history"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Clock className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">View History</h3>
                <p className="text-sm text-gray-600">
                  Check your quiz attempts and results
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>
          {recentResults.length > 0 ? (
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {result.Quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.passed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.passed ? "Passed" : "Failed"}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.score}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No quiz attempts yet</p>
              <Link
                to="/quizzes"
                className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Take your first quiz →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
