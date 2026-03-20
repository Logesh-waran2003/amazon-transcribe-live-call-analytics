import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// CloudWatch log forwarder — survives page redirects
const LOG_ENDPOINT = 'https://46ddr6ryuvolcrmqfnp5q5oqcu0vokaj.lambda-url.us-east-1.on.aws/';
const _logs = [];
const _origLog = console.log.bind(console);
const _origError = console.error.bind(console);
const _origWarn = console.warn.bind(console);

const capture = (level, args) => {
  const msg = `[${level}] ` + args.map(a => {
    try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e) { return String(a); }
  }).join(' ');
  _logs.push({ t: new Date().toISOString(), msg });
};

console.log = (...a) => { _origLog(...a); capture('LOG', a); };
console.error = (...a) => { _origError(...a); capture('ERROR', a); };
console.warn = (...a) => { _origWarn(...a); capture('WARN', a); };

// Flush logs to CloudWatch every 3 seconds and on page unload
const flushLogs = () => {
  if (!_logs.length) return;
  const batch = _logs.splice(0, _logs.length);
  navigator.sendBeacon(LOG_ENDPOINT, JSON.stringify({ logs: batch }));
};
setInterval(flushLogs, 3000);
window.addEventListener('beforeunload', flushLogs);
window.addEventListener('pagehide', flushLogs);

console.log('🚀 index.js: Starting app, URL:', window.location.href);
// Amplify is configured synchronously in use-aws-config.js at module load time

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
console.log('✅ index.js: React rendered');
