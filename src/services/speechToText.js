class SpeechToTextService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onTranscript = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    this.transcript = '';
    this.interimTranscript = '';
  }

  // Initialize speech recognition
  initialize() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStart?.();
    };

    this.recognition.onresult = (event) => {
      this.interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          this.transcript += transcript + ' ';
        } else {
          this.interimTranscript += transcript;
        }
      }

      this.onTranscript?.(this.transcript, this.interimTranscript);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd?.();
    };
  }

  // Start listening
  startListening() {
    if (!this.recognition) {
      this.initialize();
    }

    if (!this.isListening) {
      this.transcript = '';
      this.interimTranscript = '';
      this.recognition.start();
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Toggle listening
  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  // Get current transcript
  getTranscript() {
    return this.transcript;
  }

  // Clear transcript
  clearTranscript() {
    this.transcript = '';
    this.interimTranscript = '';
  }

  // Check if speech recognition is supported
  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Set callbacks
  setCallbacks({ onTranscript, onError, onStart, onEnd }) {
    this.onTranscript = onTranscript;
    this.onError = onError;
    this.onStart = onStart;
    this.onEnd = onEnd;
  }
}

export default new SpeechToTextService();
