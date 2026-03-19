import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.log('🚀 index.js: Starting app');
// Amplify is configured synchronously in use-aws-config.js at module load time

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
console.log('✅ index.js: React rendered');
