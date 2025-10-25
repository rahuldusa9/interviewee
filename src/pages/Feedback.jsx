import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  StarIcon,
  DocumentArrowDownIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Feedback = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({
    session: null,
    submissions: [],
    results: {},
    aiAnalysis: {},
    speechAnalysis: {},
    overallScore: 0,
    recommendations: []
  });

  useEffect(() => {
    fetchFeedbackData();
  }, [sessionId]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const intervieweeId = localStorage.getItem('intervieweeId') || '1';
      
      const [sessionData, feedbackData, submissionsData] = await Promise.all([
        apiService.getSessionDetails(sessionId),
        apiService.getFeedback(intervieweeId),
        apiService.getSubmissionResults(sessionId)
      ]);

      setFeedback({
        session: sessionData.data,
        submissions: submissionsData.data || [],
        results: feedbackData.data?.results || {},
        aiAnalysis: feedbackData.data?.aiAnalysis || {},
        speechAnalysis: feedbackData.data?.speechAnalysis || {},
        overallScore: feedbackData.data?.overallScore || 0,
        recommendations: feedbackData.data?.recommendations || []
      });
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      // Mock data for demo
      setFeedback({
        session: {
          id: sessionId,
          title: 'Frontend Developer Interview',
          completedAt: '2024-01-15T12:00:00Z',
          duration: 60
        },
        submissions: [
          {
            id: '1',
            questionId: 'q1',
            questionTitle: 'Two Sum',
            code: 'function twoSum(nums, target) {\n  // Your solution here\n}',
            language: 'javascript',
            status: 'accepted',
            score: 85,
            executionTime: 1.2,
            memoryUsage: 45.6,
            testCases: {
              passed: 8,
              total: 10
            }
          },
          {
            id: '2',
            questionId: 'q2',
            questionTitle: 'Reverse Linked List',
            code: 'function reverseList(head) {\n  // Your solution here\n}',
            language: 'javascript',
            status: 'partial',
            score: 60,
            executionTime: 2.1,
            memoryUsage: 52.3,
            testCases: {
              passed: 6,
              total: 10
            }
          }
        ],
        results: {
          totalScore: 72.5,
          timeSpent: 45,
          questionsAttempted: 2,
          questionsSolved: 1
        },
        aiAnalysis: {
          codeQuality: 7.5,
          algorithmEfficiency: 6.8,
          problemSolving: 7.2,
          communication: 8.1,
          timeManagement: 6.5
        },
        speechAnalysis: {
          confidence: 7.8,
          clarity: 8.2,
          technicalAccuracy: 7.5,
          communicationStyle: 8.0
        },
        overallScore: 72.5,
        recommendations: [
          'Focus on optimizing time complexity for dynamic programming problems',
          'Practice explaining your thought process more clearly',
          'Work on implementing edge cases in your solutions',
          'Consider using more descriptive variable names'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // Create a simple text report
    const report = `
Interview Feedback Report
========================

Session: ${feedback.session?.title}
Completed: ${new Date(feedback.session?.completedAt).toLocaleString()}
Duration: ${feedback.session?.duration} minutes

Overall Score: ${feedback.overallScore}/100

Results Summary:
- Questions Attempted: ${feedback.results.questionsAttempted}
- Questions Solved: ${feedback.results.questionsSolved}
- Time Spent: ${feedback.results.timeSpent} minutes

AI Analysis:
- Code Quality: ${feedback.aiAnalysis.codeQuality}/10
- Algorithm Efficiency: ${feedback.aiAnalysis.algorithmEfficiency}/10
- Problem Solving: ${feedback.aiAnalysis.problemSolving}/10
- Communication: ${feedback.aiAnalysis.communication}/10
- Time Management: ${feedback.aiAnalysis.timeManagement}/10

Recommendations:
${feedback.recommendations.map(rec => `- ${rec}`).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-feedback-${sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const radarData = [
    { skill: 'Code Quality', score: feedback.aiAnalysis.codeQuality },
    { skill: 'Algorithm Efficiency', score: feedback.aiAnalysis.algorithmEfficiency },
    { skill: 'Problem Solving', score: feedback.aiAnalysis.problemSolving },
    { skill: 'Communication', score: feedback.aiAnalysis.communication },
    { skill: 'Time Management', score: feedback.aiAnalysis.timeManagement }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
          <p className="mt-2 text-gray-600">
            {feedback.session?.title} • Completed on {new Date(feedback.session?.completedAt).toLocaleDateString()}
          </p>
        </div>
        
        <button
          onClick={downloadReport}
          className="btn-primary flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Overall Score */}
      <div className="card">
        <div className="text-center">
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {feedback.overallScore}
          </div>
          <div className="text-xl text-gray-600 mb-4">Overall Score</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${feedback.overallScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {feedback.results.questionsAttempted}
          </div>
          <div className="text-sm text-gray-600">Questions Attempted</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600 mb-1">
            {feedback.results.questionsSolved}
          </div>
          <div className="text-sm text-gray-600">Questions Solved</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600 mb-1">
            {feedback.results.timeSpent}
          </div>
          <div className="text-sm text-gray-600">Minutes Spent</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {Math.round((feedback.results.questionsSolved / feedback.results.questionsAttempted) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Skills Radar Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Assessment</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis domain={[0, 10]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Submissions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Question Submissions</h3>
        <div className="space-y-4">
          {feedback.submissions.map((submission) => (
            <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{submission.questionTitle}</h4>
                <div className="flex items-center space-x-2">
                  {submission.status === 'accepted' ? (
                    <CheckCircleIcon className="w-5 h-5 text-success-500" />
                  ) : submission.status === 'partial' ? (
                    <ClockIcon className="w-5 h-5 text-warning-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-danger-500" />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {submission.score}/100
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Language:</span>
                  <span className="ml-1 font-medium">{submission.language}</span>
                </div>
                <div>
                  <span className="text-gray-500">Execution Time:</span>
                  <span className="ml-1 font-medium">{submission.executionTime}s</span>
                </div>
                <div>
                  <span className="text-gray-500">Memory Usage:</span>
                  <span className="ml-1 font-medium">{submission.memoryUsage}MB</span>
                </div>
                <div>
                  <span className="text-gray-500">Test Cases:</span>
                  <span className="ml-1 font-medium">
                    {submission.testCases.passed}/{submission.testCases.total}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="w-5 h-5 mr-2 text-warning-500" />
          AI Recommendations
        </h3>
        <div className="space-y-3">
          {feedback.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Speech Analysis */}
      {feedback.speechAnalysis && Object.keys(feedback.speechAnalysis).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {feedback.speechAnalysis.confidence}/10
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {feedback.speechAnalysis.clarity}/10
              </div>
              <div className="text-sm text-gray-600">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {feedback.speechAnalysis.technicalAccuracy}/10
              </div>
              <div className="text-sm text-gray-600">Technical Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {feedback.speechAnalysis.communicationStyle}/10
              </div>
              <div className="text-sm text-gray-600">Communication Style</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/interviews')}
          className="btn-secondary"
        >
          View All Interviews
        </button>
      </div>
    </div>
  );
};

export default Feedback;
