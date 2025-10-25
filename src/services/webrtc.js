import SimplePeer from 'simple-peer';

class WebRTCService {
  constructor() {
    this.peer = null;
    this.localStream = null;
    this.remoteStream = null;
    this.isInitiator = false;
    this.onRemoteStream = null;
    this.onConnectionStateChange = null;
  }

  // Initialize local media stream
  async initializeLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  // Create peer connection
  createPeer(isInitiator, signalData = null) {
    this.isInitiator = isInitiator;
    
    this.peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream: this.localStream,
    });

    // Handle signal data
    this.peer.on('signal', (data) => {
      this.onSignal?.(data);
    });

    // Handle incoming stream
    this.peer.on('stream', (stream) => {
      this.remoteStream = stream;
      this.onRemoteStream?.(stream);
    });

    // Handle connection state changes
    this.peer.on('connect', () => {
      console.log('WebRTC connection established');
      this.onConnectionStateChange?.('connected');
    });

    this.peer.on('close', () => {
      console.log('WebRTC connection closed');
      this.onConnectionStateChange?.('closed');
    });

    this.peer.on('error', (err) => {
      console.error('WebRTC error:', err);
      this.onConnectionStateChange?.('error');
    });

    // If we have signal data, signal the peer
    if (signalData) {
      this.peer.signal(signalData);
    }
  }

  // Signal peer with data
  signalPeer(signalData) {
    if (this.peer) {
      this.peer.signal(signalData);
    }
  }

  // Send data through data channel
  sendData(data) {
    if (this.peer && this.peer.connected) {
      this.peer.send(JSON.stringify(data));
    }
  }

  // Handle incoming data
  onData(callback) {
    if (this.peer) {
      this.peer.on('data', (data) => {
        try {
          const parsedData = JSON.parse(data.toString());
          callback(parsedData);
        } catch (error) {
          console.error('Error parsing data:', error);
        }
      });
    }
  }

  // Mute/unmute audio
  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  // Mute/unmute video
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  // End call
  endCall() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.remoteStream = null;
    this.onConnectionStateChange?.('ended');
  }

  // Cleanup
  cleanup() {
    this.endCall();
  }
}

export default new WebRTCService();
