import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';

interface Message {
  type: 'agent' | 'user';
  text: string;
  id?: string;
}

const MessageBubble = ({ type, text }: Message) => {
  const isAgent = type === 'agent';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isAgent ? 'flex-start' : 'flex-end',
        marginBottom: '0.5rem',
      }}
    >
      <div
        style={{
          backgroundColor: isAgent ? '#e0ecff' : '#d1ffd6',
          padding: '8px 12px',
          borderRadius: '12px',
          maxWidth: '70%',
          wordBreak: 'break-word',
          fontSize: '14px',
        }}
      >
        <strong>{isAgent ? 'Agent: ' : 'You: '}</strong>
        {text}
      </div>
    </div>
  );
};

const SimpleVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const allMessages: Message[] = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: 'agent' as const })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: 'user' as const })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  return (
    <div style={{ padding: '1rem', marginTop: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <BarVisualizer state={state} barCount={7} trackRef={audioTrack} />
      </div>
      <div
        style={{
          height: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#fafafa',
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={msg.id || idx} {...msg} />
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <VoiceAssistantControlBar />
      </div>
    </div>
  );
};

export default SimpleVoiceAssistant;
