package main

import (
	"encoding/json" // Para (des)codificar JSON
	"fmt"
	"io"       // Para ler o "corpo" do pedido (o body)
	"net/http" // O "garçom"
	"sync"     // Para "trancar" a geladeira (evitar bagunça)

	"github.com/google/uuid" // A ferramenta de gerar IDs únicos
)

// 4. A "Geladeira" (Armazenamento)
// Agora é um "mapa" onde a "chave" é o ID (string) e o "valor" é a Tarefa (Task)
var tasks = make(map[string]Task)

// 4.1 O "Cadeado" da Geladeira
// Um Mutex é um "cadeado" para evitar que dois pedidos tentem mudar a lista de tarefas
// ao mesmo tempo (o que causaria um "race condition")
var tasksMutex = &sync.Mutex{}

// 8. O "Roteador" do Cardápio
// Esta função agora é um "roteador": ela olha o "método" do pedido
// (GET, POST, PUT, DELETE) e chama a função correta.
func handleTasks(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Recebi um pedido: %s %s\n", r.Method, r.URL.Path)

	switch r.Method {
	case "GET":
		handleGetTasks(w, r)
	case "POST":
		handleCreateTask(w, r)
	case "PUT":
		handleUpdateTask(w, r)
	case "DELETE":
		handleDeleteTask(w, r)
	default:
		// Se o método não for um desses, enviamos "Método Não Permitido"
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

// --- Funções CRUD ---

// GET /tasks - Lista todas as tarefas
func handleGetTasks(w http.ResponseWriter, r *http.Request) {
	// Tranca o "cadeado" para ler
	tasksMutex.Lock()
	defer tasksMutex.Unlock() // "defer" garante que o cadeado será destrancado no fim da função

	// Como "tasks" é um mapa, precisamos convertê-lo em uma lista para enviar
	var taskList []Task
	for _, task := range tasks {
		taskList = append(taskList, task)
	}

	// Responde com a lista de tarefas em formato JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(taskList)
}

// POST /tasks - Cria uma nova tarefa
func handleCreateTask(w http.ResponseWriter, r *http.Request) {
	// Lê o "corpo" (body) do pedido
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erro ao ler o corpo da requisição", http.StatusInternalServerError)
		return
	}

	var task Task
	// Converte o texto JSON do body para a nossa "receita" (struct) Task
	if err := json.Unmarshal(body, &task); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	// VALIDAÇÃO (Obrigatório no desafio) [cite: 15]
	if task.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}

	// Cria um ID único e define o Status inicial
	task.ID = uuid.New().String()
	if task.Status == "" {
		task.Status = "A Fazer" // Status padrão
	}

	// Tranca o "cadeado" para escrever
	tasksMutex.Lock()
	tasks[task.ID] = task
	tasksMutex.Unlock()

	// Responde com "201 Created" e a tarefa que acabou de ser criada
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

// PUT /tasks - Atualiza uma tarefa existente
func handleUpdateTask(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erro ao ler o corpo da requisição", http.StatusInternalServerError)
		return
	}

	var task Task
	if err := json.Unmarshal(body, &task); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	// VALIDAÇÃO: Precisa de um ID e um Título
	if task.ID == "" {
		http.Error(w, "O ID é obrigatório para atualizar", http.StatusBadRequest)
		return
	}
	if task.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}

	// Tranca o "cadeado"
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	// Verifica se a tarefa realmente existe na nossa "geladeira" (mapa)
	_, ok := tasks[task.ID]
	if !ok {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	// Atualiza a tarefa no mapa
	tasks[task.ID] = task

	// Responde com a tarefa atualizada
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

// DELETE /tasks?id=... - Deleta uma tarefa
func handleDeleteTask(w http.ResponseWriter, r *http.Request) {
	// No DELETE, vamos pegar o ID pela URL (ex: /tasks?id=123-abc)
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "O parâmetro 'id' é obrigatório", http.StatusBadRequest)
		return
	}

	// Tranca o "cadeado"
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	// Verifica se a tarefa existe
	_, ok := tasks[id]
	if !ok {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	// Deleta a tarefa do mapa
	delete(tasks, id)

	// Responde com "200 OK" e uma mensagem
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Tarefa deletada com sucesso"})
}

// Esta função (que estava no main.go) não é mais necessária
// func handleNotFound(w http.ResponseWriter, r *http.Request) {
// 	w.WriteHeader(http.StatusNotFound)
// 	fmt.Fprintln(w, "Ops! Página não encontrada.")
// }
