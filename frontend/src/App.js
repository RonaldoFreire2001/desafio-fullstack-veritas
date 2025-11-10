import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import './App.css'; // <-- ESTA LINHA É O CONSERTO!

function App() {
  return (
    // A classe "App" agora vai ser lida pelo App.css
    <div className="App">
      <header>
        <h1>Meu Mini Kanban</h1>
      </header>
      
      <KanbanBoard />
    </div>
  );
}

export default App;