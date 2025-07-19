import { useState, useCallback } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import SimpleVoiceAssistant from './SimpleVoiceAssistant'; // ⬅️ You’ll create this in a moment

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const connect = useCallback(async () => {
    const identity = 'user-' + Math.floor(Math.random() * 1000);
    const roomName = 'test-room';

    const res = await fetch(`${TOKEN_ENDPOINT}?identity=${identity}&room=${roomName}`);
    const { token } = await res.json();
    setToken(token);
    setIsConnected(true);
  }, []);

  const disconnect = () => {
    setIsConnected(false);
    setToken(null);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <img src="./src/assets/voice-icon.png" alt="Voice Icon" style={{ height: '48px' }} />
      <h2>Chat live with your voice AI agent</h2>

      {!isConnected ? (
        <button
          onClick={connect}
          style={{
            backgroundColor: '#0047FF',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none',
            marginTop: '1rem',
          }}
        >
          START CALL
        </button>
      ) : (
        token && (
          <LiveKitRoom
            serverUrl={LIVEKIT_URL}
            token={token}
            connect={true}
            video={false}
            audio={true}
            onDisconnected={disconnect}
            style={{ height: '100%' }}
          >
            <RoomAudioRenderer />
            <SimpleVoiceAssistant />
          </LiveKitRoom>
        )
      )}
    </div>
  );
}

export default App;
