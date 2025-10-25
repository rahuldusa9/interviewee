import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  ChartBarIcon, 
  ClockIcon, 
  StarIcon,
  PlayIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageRating: 0,
    upcomingSessions: [],
    analytics: {
      performanceTrend: [],
      weakTopics: [],
      improvementAreas: []
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const intervieweeId = localStorage.getItem('intervieweeId') || '1'; // Mock ID
      
      const [interviewsCount, ratings, analytics, upcomingSessions] = await Promise.all([
        apiService.getInterviewsCount(intervieweeId),
        apiService.getRatings(intervieweeId),
        apiService.getAnalytics(intervieweeId),
        apiService.getUpcomingSessions()
      ]);

      setStats({
        totalInterviews: interviewsCount.data.count || 0,
        averageRating: ratings.data.average || 0,
        upcomingSessions: upcomingSessions.data || [],
        analytics: analytics.data || {
          performanceTrend: [],
          weakTopics: [],
          improvementAreas: []
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Mock data for demo
      setStats({
        totalInterviews: 12,
        averageRating: 4.2,
        upcomingSessions: [
          {
            id: '1',
            title: 'Frontend Developer Interview',
            scheduledAt: '2024-01-15T10:00:00Z',
            duration: 60,
            interviewer: 'John Doe'
          },
          {
            id: '2',
            title: 'System Design Interview',
            scheduledAt: '2024-01-16T14:00:00Z',
            duration: 90,
            interviewer: 'Jane Smith'
          }
        ],
        analytics: {
          performanceTrend: [
            { month: 'Jan', score: 75 },
            { month: 'Feb', score: 82 },
            { month: 'Mar', score: 78 },
            { month: 'Apr', score: 85 },
            { month: 'May', score: 88 },
            { month: 'Jun', score: 92 }
          ],
          weakTopics: [
            { topic: 'Dynamic Programming', score: 60 },
            { topic: 'System Design', score: 65 },
            { topic: 'Database Design', score: 70 }
          ],
          improvementAreas: [
            'Algorithm optimization',
            'Code readability',
            'Time complexity analysis'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinInterview = (sessionId) => {
    navigate(`/interview/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's your interview performance overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Interviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalInterviews}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}/5.0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingSessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.analytics.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Topics */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weak Topics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.analytics.weakTopics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="topic" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="score" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Interview Sessions</h3>
        <div className="space-y-4">
          {stats.upcomingSessions.length > 0 ? (
            stats.upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(session.scheduledAt).toLocaleString()} • {session.duration} minutes
                  </p>
                  <p className="text-sm text-gray-500">Interviewer: {session.interviewer}</p>
                </div>
                <button
                  onClick={() => handleJoinInterview(session.id)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Join Interview</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming interview sessions</p>
          )}
        </div>
      </div>

      {/* Improvement Areas */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h3>
        <div className="space-y-2">
          {stats.analytics.improvementAreas.map((area, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ArrowUpIcon className="w-4 h-4 text-primary-600" />
              <span className="text-gray-700">{area}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
