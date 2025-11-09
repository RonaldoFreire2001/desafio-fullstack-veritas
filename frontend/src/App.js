// Importa o React e o nosso quadro Kanban
import React from 'react';
import KanbanBoard from './components/KanbanBoard';

// A "função" App é o nosso componente principal
function App() {
  // "return (...)" é o que o componente "desenha" na tela
  return (
    <div className="App">
      {/* Um cabeçalho simples */}
      <header>
        <h1>Meu Mini Kanban</h1>
      </header>
      
      {/* Aqui nós mandamos o React desenhar o nosso quadro */}
      <KanbanBoard />
    </div>
  );
}

// Exporta o App para que o "index.js" (o porteiro) possa usá-lo
export default App;