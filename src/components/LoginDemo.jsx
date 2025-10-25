import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginDemo = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const userData = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'interviewee'
    };
    
    const token = 'demo-token-123';
    
    login(userData, token);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Interviewee Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Real-Time Collaborative Interview Platform
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <UserIcon className="mx-auto h-12 w-12 text-primary-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Demo Login
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Click the button below to access the demo with mock data
              </p>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    Enter Demo Mode
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Features</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Dashboard with analytics</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Real-time coding interviews</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Video calls with WebRTC</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">AI-powered feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDemo;
