import React, { useState } from 'react';

const API_URL = 'http://localhost:8080/tasks';

function TaskCard({ task, refreshTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editTitle) {
      alert('O título é obrigatório!');
      return;
    }
    try {
      const updatedTask = {
        ...task,
        title: editTitle,
        description: editDescription,
      };
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        alert('Erro ao salvar a tarefa.');
        return;
      }
      refreshTasks();
      setIsEditing(false);
    } catch (error) {
      console.error('Falha ao salvar tarefa:', error);
    }
  };

  const handleMove = async (newStatus) => {
    try {
      const updatedTask = { ...task, status: newStatus };
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        alert('Erro ao mover a tarefa.');
        return;
      }
      refreshTasks();
    } catch (error) {
      console.error('Falha ao mover tarefa:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir a tarefa: "${task.title}"?`)) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}?id=${task.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        alert('Erro ao deletar a tarefa.');
        return;
      }
      refreshTasks();
    } catch (error) {
      console.error('Falha ao deletar tarefa:', error);
    }
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <form onSubmit={handleEditSave}>
          <div>
            <label>Título:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '90%', margin: '5px 0' }}
            />
          </div>
          <div>
            <label>Descrição:</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{ width: '90%', margin: '5px 0' }}
            />
          </div>
          <div>
            <button type="submit" style={{ marginRight: '10px' }}>
              Salvar
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {task.status !== 'A Fazer' && (
              <button onClick={() => handleMove('A Fazer')}>⬅️ A Fazer</button>
            )}
            {task.status !== 'Em Progresso' && (
              <button onClick={() => handleMove('Em Progresso')}>➡️ Em Progresso</button>
            )}
            {task.status !== 'Concluídas' && (
              <button onClick={() => handleMove('Concluídas')}>➡️ Concluídas</button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginLeft: 'auto' }}
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer' }}
            >
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;