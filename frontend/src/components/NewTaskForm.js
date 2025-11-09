// Importa o "useState" para guardarmos o que o usuário digita
import React, { useState } from 'react';

// "props" (propriedades) que ele recebe:
// "onSave" é a *função* que o "KanbanBoard" (o pai) vai nos passar para salvar.
// "onCancel" é a *função* para fechar o formulário.
function NewTaskForm({ onSave, onCancel }) {
  // Criamos "gavetas" (estado) para o título e a descrição
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Ação que acontece quando o usuário clica em "Salvar"
  const handleSubmit = async (e) => {
    // "e.preventDefault()" impede o navegador de recarregar a página
    e.preventDefault();

    // VALIDAÇÃO (o desafio pede)
    if (!title) {
      alert('O título é obrigatório!');
      return;
    }

    // "Chama" a função "onSave" que o pai nos deu,
    // e passa a nova tarefa para ele.
    onSave({ title, description });
  };

  return (
    // "onSubmit" é o evento do formulário
    <form onSubmit={handleSubmit} className="task-card">
      <h3>Nova Tarefa</h3>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={title} // O valor do input é "amarrado" ao nosso estado
          onChange={e => setTitle(e.target.value)} // Quando digita, atualiza o estado
          style={{ width: '90%', margin: '5px 0' }}
        />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '90%', margin: '5px 0' }}
        />
      </div>
      <div>
        {/* O botão de Salvar (tipo "submit") ativa o "onSubmit" do formulário */}
        <button type="submit" style={{ marginRight: '10px' }}>Salvar</button>
        {/* O botão Cancelar (tipo "button") só chama a função "onCancel" */}
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default NewTaskForm;