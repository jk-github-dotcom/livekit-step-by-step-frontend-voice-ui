import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { RoomAudioRenderer, RoomContext } from '@livekit/components-react';
import { LocalAudioTrack, createLocalAudioTrack } from 'livekit-client';
import { Participant } from 'livekit-client';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT;

function App() {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);

  const connectToRoom = async () => {
    try {
      const identity = 'user-' + Math.floor(Math.random() * 1000);
      const roomName = 'test-room';
      const res = await fetch(`${TOKEN_ENDPOINT}?identity=${identity}&room=${roomName}`);
      const { token } = await res.json();

      const newRoom = new Room();
      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log(`${participant.identity} joined`);
      });

      await newRoom.connect(LIVEKIT_URL, token);
      console.log('Connected to LiveKit');
      setRoom(newRoom);
      setIsConnected(true);
	  
	  // ✅ Publish microphone audio
      const micTrack: LocalAudioTrack = await createLocalAudioTrack();
      await newRoom.localParticipant.publishTrack(micTrack);
      console.log('Microphone track published');

      // ✅ Transcription
      newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
        const text = new TextDecoder().decode(payload);
        console.log('Transcript received:', text);
        setTranscripts((prev) => [...prev, `${participant.identity}: ${text}`]);
      });
	  
//	  setTranscripts(prev => [...prev, "Test: This is a test message"]);
	  
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  const disconnectFromRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
      console.log('Disconnected from LiveKit');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (room) {
        room.disconnect();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [room]);

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <img src="./src/assets/voice-icon.png" alt="Voice Icon" style={{ height: '48px' }} />
      <h2>Chat live with your voice AI agent</h2>

      {!isConnected ? (
        <button
          onClick={connectToRoom}
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
        <button
          onClick={disconnectFromRoom}
          style={{
            backgroundColor: '#FF4747',
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
          END CALL
        </button>
      )}

      {room && (
        <RoomContext.Provider value={room}>
          <RoomAudioRenderer />
        </RoomContext.Provider>
      )}
	  
      {/* 🔽 Transcription Panel */}
      {isConnected && (
        <div
          style={{
            marginTop: '2rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            maxHeight: '200px',
            overflowY: 'auto',
            textAlign: 'left',
            width: '60%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Transcripts</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {transcripts.map((msg, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{msg}</li>
            ))}
          </ul>
        </div>
      )}	  
    </div>
  );
}

export default App;
