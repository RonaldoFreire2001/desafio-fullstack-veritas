import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- ESTE É O CONSERTO
import './index.css';                     // <-- Vamos re-adicionar isso
import App from './App';

// Nós removemos reportWebVitals, então não o importamos mais.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);