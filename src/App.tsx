import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT;

function App() {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const identity = 'user-' + Math.floor(Math.random() * 1000);
        const roomName = 'test-room';
        const res = await fetch(`${TOKEN_ENDPOINT}?identity=${identity}&room=${roomName}`);
        const { token } = await res.json();

        const room = new Room();
        room.on(RoomEvent.ParticipantConnected, participant => {
          console.log(`${participant.identity} joined`);
        });

        await room.connect(LIVEKIT_URL, token);
        console.log('Connected to LiveKit');
        setRoom(room);

        // 👇 Disconnect when tab is closed or refreshed
        const handleBeforeUnload = () => {
          room.disconnect();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        // ✅ Clean up listener when component unmounts
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          room.disconnect(); // also disconnect if React unmounts the component
        };
      } catch (err) {
        console.error('Connection error:', err);
      }
    };

    const cleanupPromise = connectToRoom();

    // Return cleanup for React (in case connectToRoom resolves late)
    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, []);


  return (
    <div>
      <h1>LiveKit Voice Assistant</h1>
      {room ? <p>Connected to room!</p> : <p>Connecting...</p>}
    </div>
  );
}

export default App;

