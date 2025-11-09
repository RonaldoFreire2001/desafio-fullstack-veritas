import React, { useState } from 'react'; // 1. Importamos o "useState"

// O endereço do nosso "garçom" Go
const API_URL = 'http://localhost:8080/tasks';

// Recebe a "task" e a função "refreshTasks"
function TaskCard({ task, refreshTasks }) {
  // 2. NOVAS "GAVETAS" (Estado)
  // "isEditing" guarda se o cartão está no modo de edição (true/false)
  const [isEditing, setIsEditing] = useState(false);
  // "editTitle" guarda o texto do campo de título (enquanto edita)
  const [editTitle, setEditTitle] = useState(task.title);
  // "editDescription" guarda o texto da descrição (enquanto edita)
  const [editDescription, setEditDescription] = useState(task.description);

  // 3. A FUNÇÃO DE "SALVAR EDIÇÃO" (PUT)
  const handleEditSave = async (e) => {
    e.preventDefault(); // Impede o formulário de recarregar a página

    // Validação
    if (!editTitle) {
      alert('O título é obrigatório!');
      return;
    }

    try {
      // 1. Criamos a "cópia" da tarefa com os dados atualizados
      const updatedTask = {
        ...task, // Copia id e status
        title: editTitle, // Usa o novo título
        description: editDescription, // Usa a nova descrição
      };

      // 2. Usamos o "fetch" com o método "PUT" (o MESMO do "Mover")
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask), // 3. Enviamos a tarefa atualizada
      });

      if (!response.ok) {
        alert('Erro ao salvar a tarefa.');
        return;
      }

      // 4. SUCESSO!
      refreshTasks(); // Mandamos o "KanbanBoard" buscar a lista de tarefas
      setIsEditing(false); // 5. Saímos do modo de edição
    } catch (error) {
      console.error('Falha ao salvar tarefa:', error);
    }
  };

  // 4. A FUNÇÃO DE "MOVER" (Exatamente igual a antes)
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

  // 5. A FUNÇÃO DE "DELETAR" (Exatamente igual a antes)
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

  // 6. O "DESENHO" DO CARTÃO (Agora com um "if")
  return (
    <div className="task-card">
      {/* AQUI ESTÁ A MÁGICA:
        Se "isEditing" for VERDADEIRO, mostre o formulário.
        Senão ("else"), mostre o cartão normal.
      */}
      {isEditing ? (
        // --- MODO DE EDIÇÃO (Formulário) ---
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
        // --- MODO NORMAL (Visualização) ---
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {/* Botões de Mover */}
            {task.status !== 'A Fazer' && (
              <button onClick={() => handleMove('A Fazer')}>⬅️ A Fazer</button>
            )}
            {task.status !== 'Em Progresso' && (
              <button onClick={() => handleMove('Em Progresso')}>➡️ Em Progresso</button>
            )}
            {task.status !== 'Concluídas' && (
              <button onClick={() => handleMove('Concluídas')}>➡️ Concluídas</button>
            )}

            {/* Botão de Editar (que ativa o modo de edição) */}
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginLeft: 'auto' }}
            >
              Editar
            </button>

            {/* Botão de Excluir */}
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