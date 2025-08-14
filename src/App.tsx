import React from 'react';
import ChatInterface from './components/ChatInterface';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <ChatInterface />
    </SettingsProvider>
  );
}

export default App;
