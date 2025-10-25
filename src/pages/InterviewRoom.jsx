import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { apiService } from '../services/api';
import { useAutoSave } from '../hooks/useAutoSave';
import webRTCService from '../services/webrtc';
import speechToTextService from '../services/speechToText';
import QuestionPanel from '../components/QuestionPanel';
import { 
  PlayIcon, 
  PaperAirplaneIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Video/WebRTC state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const editorRef = useRef(null);
  
  // Auto-save hook
  const { manualSave } = useAutoSave(code, sessionId, questions[currentQuestion]?.id, language);

  useEffect(() => {
    initializeInterview();
    return () => {
      cleanup();
    };
  }, [sessionId]);

  const initializeInterview = async () => {
    try {
      // Fetch session details and questions
      const [sessionData, questionsData] = await Promise.all([
        apiService.getSessionDetails(sessionId),
        apiService.getSessionQuestions(sessionId)
      ]);
      
      setSession(sessionData.data);
      setQuestions(questionsData.data);
      
      // Initialize WebRTC
      await initializeWebRTC();
      
      // Initialize speech-to-text
      initializeSpeechToText();
      
    } catch (error) {
      console.error('Error initializing interview:', error);
    }
  };

  const initializeWebRTC = async () => {
    try {
      const stream = await webRTCService.initializeLocalStream();
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Set up WebRTC callbacks
      webRTCService.onRemoteStream = (stream) => {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };
      
      webRTCService.onConnectionStateChange = (state) => {
        setIsConnected(state === 'connected');
      };
      
      // Create peer connection (assuming we're the interviewee)
      webRTCService.createPeer(false);
      
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
    }
  };

  const initializeSpeechToText = () => {
    if (!speechToTextService.isSupported()) {
      console.warn('Speech recognition not supported');
      return;
    }
    
    speechToTextService.setCallbacks({
      onTranscript: (final, interim) => {
        setTranscript(final);
        setInterimTranscript(interim);
        
        // Send speech analysis to backend
        if (final.trim()) {
          analyzeSpeech(final);
        }
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      },
      onStart: () => {
        setIsListening(true);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const analyzeSpeech = async (text) => {
    try {
      await apiService.analyzeSpeech({
        sessionId,
        text,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error analyzing speech:', error);
    }
  };

  const runCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      const result = await apiService.runCode({
        code,
        language,
        input: questions[currentQuestion]?.testCases?.[0]?.input || ''
      });
      
      setOutput(result.data.output || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async () => {
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await manualSave(); // Save before submitting
      
      const result = await apiService.submitSolution({
        sessionId,
        questionId: questions[currentQuestion].id,
        code,
        language
      });
      
      alert('Solution submitted successfully!');
      
      // Move to next question or finish interview
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCode('');
        setOutput('');
      } else {
        navigate(`/feedback/${sessionId}`);
      }
      
    } catch (error) {
      alert(`Error submitting solution: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVideo = () => {
    const enabled = webRTCService.toggleVideo();
    setIsVideoEnabled(enabled);
  };

  const toggleAudio = () => {
    const enabled = webRTCService.toggleAudio();
    setIsAudioEnabled(enabled);
  };

  const toggleSpeechToText = () => {
    if (isListening) {
      speechToTextService.stopListening();
    } else {
      speechToTextService.startListening();
    }
  };

  const leaveInterview = () => {
    if (window.confirm('Are you sure you want to leave the interview?')) {
      cleanup();
      navigate('/dashboard');
    }
  };

  const cleanup = () => {
    webRTCService.cleanup();
    speechToTextService.stopListening();
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  if (!session || !questions.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{session.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          {/* Video Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleVideo}
              className={`p-2 rounded-lg ${
                isVideoEnabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <VideoCameraIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg ${
                isAudioEnabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleSpeechToText}
              className={`p-2 rounded-lg ${
                isListening ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={leaveInterview}
              className="p-2 rounded-lg bg-danger-100 text-danger-600 hover:bg-danger-200"
            >
              <PhoneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Video */}
        <div className="w-1/3 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            {/* Local Video */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">You</h3>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-32 object-cover"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoCameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Remote Video */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Interviewer</h3>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="w-full h-32 object-cover"
                />
                {!remoteStream && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <VideoCameraIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Waiting for interviewer...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-success-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor and Questions */}
        <div className="flex-1 flex flex-col">
          {/* Question Panel */}
          <div className="h-1/3 border-b border-gray-200">
            <QuestionPanel
              question={questions[currentQuestion]}
              onQuestionChange={setCurrentQuestion}
              currentIndex={currentQuestion}
              totalQuestions={questions.length}
            />
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field w-32"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning || !code.trim()}
                  className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
                
                <button
                  onClick={submitSolution}
                  disabled={isSubmitting || !code.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={setCode}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
          
          {/* Output Console */}
          <div className="h-32 bg-gray-900 text-white p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Output</h3>
              <button
                onClick={() => setOutput('')}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto h-full">
              {output || 'No output yet...'}
            </pre>
          </div>
        </div>
      </div>
      
      {/* Speech Transcript */}
      {transcript && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Speech Transcript</h3>
          <p className="text-sm text-blue-800">
            {transcript}
            {interimTranscript && (
              <span className="text-blue-600 italic">{interimTranscript}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
