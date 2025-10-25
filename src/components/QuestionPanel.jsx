import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const QuestionPanel = ({ 
  question, 
  onQuestionChange, 
  currentIndex, 
  totalQuestions 
}) => {
  const [activeTab, setActiveTab] = useState('description');

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No question selected</p>
      </div>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onQuestionChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      onQuestionChange(currentIndex + 1);
    }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'examples', label: 'Examples' },
    { id: 'constraints', label: 'Constraints' }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {question.title}
          </h2>
          <p className="text-sm text-gray-600">
            Difficulty: <span className="font-medium">{question.difficulty}</span>
          </p>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {totalQuestions}
          </span>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === totalQuestions - 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Problem Statement</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {question.description}
                </p>
              </div>
            </div>
            
            {question.examples && question.examples.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Example</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {question.examples[0].input}
                  </pre>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Output:</strong>
                  </div>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {question.examples[0].output}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            {question.examples && question.examples.length > 0 ? (
              question.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Example {index + 1}
                  </h4>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Input
                      </span>
                      <pre className="mt-1 text-sm text-gray-700 bg-white rounded p-2 border">
                        {example.input}
                      </pre>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Output
                      </span>
                      <pre className="mt-1 text-sm text-gray-700 bg-white rounded p-2 border">
                        {example.output}
                      </pre>
                    </div>
                    
                    {example.explanation && (
                      <div>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Explanation
                        </span>
                        <p className="mt-1 text-sm text-gray-700">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No examples provided</p>
            )}
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="space-y-4">
            {question.constraints && question.constraints.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Constraints</h3>
                <ul className="space-y-1">
                  {question.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No constraints specified</p>
            )}
            
            {question.timeLimit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Time Limit</h4>
                <p className="text-sm text-yellow-700">{question.timeLimit} minutes</p>
              </div>
            )}
            
            {question.memoryLimit && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Memory Limit</h4>
                <p className="text-sm text-blue-700">{question.memoryLimit} MB</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;
