import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';

const LIVEKIT_URL = 'wss://aivoiceassistant-yf8o74l4.livekit.cloud'; // e.g. from Cloud or self-hosted
const TOKEN_ENDPOINT = 'http://localhost:8000/token'; // change when deploying

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
      } catch (err) {
        console.error('Connection error:', err);
      }
    };

    connectToRoom();
  }, []);

  return (
    <div>
      <h1>LiveKit Voice Assistant</h1>
      {room ? <p>Connected to room!</p> : <p>Connecting...</p>}
    </div>
  );
}

export default App;
