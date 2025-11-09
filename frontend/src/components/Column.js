import React from 'react';
import TaskCard from './TaskCard'; // Importa o componente "Cartão"

// Agora, além de "title" e "tasks", recebemos "refreshTasks"
function Column({ title, tasks, refreshTasks }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      
      {/*
        Para cada tarefa (task) na lista de "tasks", desenhe um "TaskCard".
        AGORA: Também passamos a função "refreshTasks" para cada cartão.
      */}
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          refreshTasks={refreshTasks} // <-- AQUI ESTÁ A MUDANÇA
        />
      ))}
    </div>
  );
}

export default Column;