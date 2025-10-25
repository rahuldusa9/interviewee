import { useState } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Demo Mode
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              This is a demo of the Interviewee Panel. The application uses mock data for demonstration purposes.
              In a real implementation, this would connect to your backend APIs.
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Dashboard shows mock analytics and upcoming sessions</li>
              <li>Interview Room simulates real-time coding with video calls</li>
              <li>Feedback page displays AI analysis and recommendations</li>
              <li>All API calls are mocked for demonstration</li>
            </ul>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex bg-blue-50 rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
