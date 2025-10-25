import axios from 'axios';
import mockData from './mockData';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API responses for demo
const mockApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// API Service Functions
export const apiService = {
  // Interviewee Overview
  getIntervieweeOverview: (id) => mockApiResponse(mockData.interviewee),
  
  // Interview Count
  getInterviewsCount: (id) => mockApiResponse({ count: mockData.interviewee.totalInterviews }),
  
  // Ratings
  getRatings: (id) => mockApiResponse({ average: mockData.interviewee.averageRating }),
  
  // Analytics
  getAnalytics: (id) => mockApiResponse(mockData.interviewee.analytics),
  
  // Upcoming Sessions
  getUpcomingSessions: () => mockApiResponse(mockData.interviewee.upcomingSessions),
  
  // Session Questions
  getSessionQuestions: (sessionId) => mockApiResponse(mockData.questions),
  
  // Code Execution
  runCode: (data) => mockApiResponse({ 
    output: 'Code executed successfully!\nTest case 1: PASSED\nTest case 2: PASSED\nTest case 3: PASSED',
    executionTime: 1.2,
    memoryUsage: 45.6
  }),
  
  // Submit Solution
  submitSolution: (data) => mockApiResponse({ 
    submissionId: 'sub_' + Date.now(),
    status: 'submitted',
    message: 'Solution submitted successfully!'
  }),
  
  // Auto Save Code
  autoSaveCode: (data) => mockApiResponse({ 
    status: 'saved',
    timestamp: new Date().toISOString()
  }),
  
  // Speech Analysis
  analyzeSpeech: (data) => mockApiResponse({ 
    analysis: 'Speech analyzed successfully',
    confidence: 0.85,
    sentiment: 'positive'
  }),
  
  // Get Feedback
  getFeedback: (id) => mockApiResponse(mockData.feedback),
  
  // Get Submission Results
  getSubmissionResults: (submissionId) => mockApiResponse(mockData.feedback.submissions),
  
  // Get Session Details
  getSessionDetails: (sessionId) => mockApiResponse(mockData.session),
};

export default api;
