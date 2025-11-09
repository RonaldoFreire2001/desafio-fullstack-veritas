import React, { useState, useEffect } from 'react';
import Column from './Column';
import NewTaskForm from './NewTaskForm'; // 1. IMPORTAMOS O FORMULÁRIO

// O endereço do nosso "garçom" Go
const API_URL = 'http://localhost:8080/tasks';

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  
  // 2. CRIAMOS UMA "GAVETA" NOVA para saber se o formulário está aberto
  const [showForm, setShowForm] = useState(false);

  // useEffect (o "telefone") continua igual, buscando os dados (GET)
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
    }
  };

  // 3. A FUNÇÃO DE "SALVAR" (POST)
  // Esta é a função que vamos passar para o "NewTaskForm"
  const handleSaveTask = async (taskData) => {
    try {
      // Usamos o "fetch" de novo, mas agora com "opções"
      const response = await fetch(API_URL, {
        method: 'POST', // 1. Dizemos que é um "POST"
        headers: {
          'Content-Type': 'application/json', // 2. Dizemos que estamos enviando JSON
        },
        body: JSON.stringify(taskData), // 3. Convertemos o objeto JS em texto JSON
      });

      if (!response.ok) {
        // Se o backend deu erro (ex: validação falhou)
        const errorData = await response.json();
        alert(`Erro ao salvar: ${errorData.message || 'Erro desconhecido'}`);
        return;
      }

      // Se deu certo, o backend nos devolve a tarefa completa (com ID e Status)
      const newTask = await response.json();

      // 4. ATUALIZAMOS A TELA *SEM RECARREGAR*
      // Pegamos todas as tarefas antigas ("...prevTasks") e adicionamos a nova.
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      // 5. Fechamos o formulário
      setShowForm(false);

    } catch (error) {
      console.error("Falha ao criar tarefa:", error);
    }
  };

  // Filtramos os dados (igual a antes)
  const todoTasks = tasks.filter(task => task.status === 'A Fazer');
  const inProgressTasks = tasks.filter(task => task.status === 'Em Progresso');
  const doneTasks = tasks.filter(task => task.status === 'Concluídas');

  return (
    <div>
      {/* 6. BOTÃO DE ADICIONAR TAREFA */}
      <div style={{ marginBottom: '20px' }}>
        {/* Se "showForm" for VERDADEIRO, mostre o formulário.
          Se for FALSO, mostre o botão "Adicionar".
        */}
        {showForm ? (
          <NewTaskForm 
            onSave={handleSaveTask} // Passamos a função de salvar
            onCancel={() => setShowForm(false)} // Passamos a função de cancelar
          />
        ) : (
          <button onClick={() => setShowForm(true)}>+ Adicionar Tarefa</button>
        )}
      </div>

      <div className="kanban-board">
        {/* Passamos as funções de "fetchTasks" para as Colunas, 
            pois vamos precisar delas para Mover/Deletar depois */}
        <Column title="A Fazer" tasks={todoTasks} refreshTasks={fetchTasks} />
        <Column title="Em Progresso" tasks={inProgressTasks} refreshTasks={fetchTasks} />
        <Column title="Concluídas" tasks={doneTasks} refreshTasks={fetchTasks} />
      </div>
    </div>
  );
}

export default KanbanBoard;