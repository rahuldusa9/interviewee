// Mock data for development and testing
export const mockData = {
  interviewee: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    totalInterviews: 12,
    averageRating: 4.2,
    upcomingSessions: [
      {
        id: '1',
        title: 'Frontend Developer Interview',
        scheduledAt: '2024-01-15T10:00:00Z',
        duration: 60,
        interviewer: 'John Smith',
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'System Design Interview',
        scheduledAt: '2024-01-16T14:00:00Z',
        duration: 90,
        interviewer: 'Jane Wilson',
        status: 'scheduled'
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
        'Time complexity analysis',
        'System design patterns'
      ]
    }
  },
  
  session: {
    id: '1',
    title: 'Frontend Developer Interview',
    description: 'Technical interview focusing on React, JavaScript, and problem-solving',
    scheduledAt: '2024-01-15T10:00:00Z',
    duration: 60,
    status: 'in_progress',
    interviewer: {
      name: 'John Smith',
      email: 'john.smith@company.com'
    }
  },
  
  questions: [
    {
      id: 'q1',
      title: 'Two Sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      difficulty: 'Easy',
      timeLimit: 30,
      memoryLimit: '64MB',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]',
          explanation: 'Because nums[2] + nums[4] == 6, we return [1, 2].'
        }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      testCases: [
        { input: '[2,7,11,15]\n9', expected: '[0,1]' },
        { input: '[3,2,4]\n6', expected: '[1,2]' },
        { input: '[3,3]\n6', expected: '[0,1]' }
      ]
    },
    {
      id: 'q2',
      title: 'Reverse Linked List',
      description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
      difficulty: 'Easy',
      timeLimit: 30,
      memoryLimit: '64MB',
      examples: [
        {
          input: 'head = [1,2,3,4,5]',
          output: '[5,4,3,2,1]'
        },
        {
          input: 'head = [1,2]',
          output: '[2,1]'
        }
      ],
      constraints: [
        'The number of nodes in the list is the range [0, 5000].',
        '-5000 <= Node.val <= 5000'
      ],
      testCases: [
        { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
        { input: '[1,2]', expected: '[2,1]' },
        { input: '[]', expected: '[]' }
      ]
    },
    {
      id: 'q3',
      title: 'Maximum Subarray',
      description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.`,
      difficulty: 'Medium',
      timeLimit: 45,
      memoryLimit: '128MB',
      examples: [
        {
          input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
          output: '6',
          explanation: '[4,-1,2,1] has the largest sum = 6.'
        },
        {
          input: 'nums = [1]',
          output: '1'
        }
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^4 <= nums[i] <= 10^4'
      ],
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
        { input: '[1]', expected: '1' },
        { input: '[5,4,-1,7,8]', expected: '23' }
      ]
    }
  ],
  
  feedback: {
    sessionId: '1',
    overallScore: 72.5,
    results: {
      totalScore: 72.5,
      timeSpent: 45,
      questionsAttempted: 3,
      questionsSolved: 2
    },
    submissions: [
      {
        id: 'sub1',
        questionId: 'q1',
        questionTitle: 'Two Sum',
        code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        language: 'javascript',
        status: 'accepted',
        score: 95,
        executionTime: 0.8,
        memoryUsage: 42.1,
        testCases: {
          passed: 3,
          total: 3
        }
      },
      {
        id: 'sub2',
        questionId: 'q2',
        questionTitle: 'Reverse Linked List',
        code: `function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`,
        language: 'javascript',
        status: 'accepted',
        score: 90,
        executionTime: 1.2,
        memoryUsage: 45.6,
        testCases: {
          passed: 3,
          total: 3
        }
      },
      {
        id: 'sub3',
        questionId: 'q3',
        questionTitle: 'Maximum Subarray',
        code: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
        language: 'javascript',
        status: 'partial',
        score: 60,
        executionTime: 2.1,
        memoryUsage: 52.3,
        testCases: {
          passed: 2,
          total: 3
        }
      }
    ],
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
    recommendations: [
      'Focus on optimizing time complexity for dynamic programming problems',
      'Practice explaining your thought process more clearly during interviews',
      'Work on implementing edge cases in your solutions',
      'Consider using more descriptive variable names for better code readability',
      'Practice system design concepts to improve your overall performance'
    ]
  }
};

export default mockData;
