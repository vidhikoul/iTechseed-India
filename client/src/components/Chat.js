import { useState } from 'react';
import {
  Webchat,
  Fab,
} from '@botpress/webchat';

const clientId = "22c1243d-0fca-436f-8cfd-dd7303f37838";

export default function App() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Floating button (smaller size) */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          width: '50px',
          height: '50px',
        }}
      >
        <Fab onClick={toggleWebchat} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Webchat container */}
      <div
        style={{
          display: isWebchatOpen ? 'block' : 'none',
          position: 'fixed',
          bottom: '80px', // above the FAB
          right: '20px',
          width: '350px',
          height: '500px',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <Webchat 
          clientId={clientId}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
