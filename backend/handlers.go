package main

import (
	"encoding/json" // Para (des)codificar JSON
	"fmt"
	"io"       // Para ler o "corpo" do pedido (o body)
	"net/http" // O "garçom"
	"os"       // Para ler e escrever arquivos (NOVO)
	"sync"     // Para "trancar" a geladeira (evitar bagunça)

	"github.com/google/uuid" // A ferramenta de gerar IDs únicos
)

// O "nome" do nosso arquivo de persistência
const tasksFilePath = "tasks.json"

// 4. A "Geladeira" (Armazenamento)
var tasks = make(map[string]Task)

// 4.1 O "Cadeado" da Geladeira
var tasksMutex = &sync.Mutex{}

// 8. O "Roteador" do Cardápio (igual a antes)
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
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

// --- Funções CRUD ---

// GET /tasks - Lista todas as tarefas (igual a antes)
func handleGetTasks(w http.ResponseWriter, r *http.Request) {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	var taskList []Task
	for _, task := range tasks {
		taskList = append(taskList, task)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(taskList)
}

// POST /tasks - Cria uma nova tarefa
func handleCreateTask(w http.ResponseWriter, r *http.Request) {
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

	if task.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}

	task.ID = uuid.New().String()
	if task.Status == "" {
		task.Status = "A Fazer" // Status padrão
	}

	tasksMutex.Lock()
	tasks[task.ID] = task
	saveTasksToFile() // <-- MUDANÇA: Salva no arquivo!
	tasksMutex.Unlock()

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

	if task.ID == "" {
		http.Error(w, "O ID é obrigatório para atualizar", http.StatusBadRequest)
		return
	}
	if task.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}

	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	_, ok := tasks[task.ID]
	if !ok {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	tasks[task.ID] = task
	saveTasksToFile() // <-- MUDANÇA: Salva no arquivo!

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

// DELETE /tasks?id=... - Deleta uma tarefa
func handleDeleteTask(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "O parâmetro 'id' é obrigatório", http.StatusBadRequest)
		return
	}

	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	_, ok := tasks[id]
	if !ok {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	delete(tasks, id)
	saveTasksToFile() // <-- MUDANÇA: Salva no arquivo!

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Tarefa deletada com sucesso"})
}

// --- FUNÇÕES DE PERSISTÊNCIA (O BÔNUS) ---

// Salva o "mapa" de tarefas atual no arquivo tasks.json
func saveTasksToFile() {
	// (Esta função é chamada *dentro* de um "lock", então não precisamos trancar de novo)
	fmt.Println("Salvando tarefas no arquivo...")

	// Converte o "mapa" de tarefas em texto JSON formatado (com indentação)
	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		fmt.Println("Erro ao converter tarefas para JSON:", err)
		return
	}

	// Escreve o texto JSON no arquivo tasks.json
	err = os.WriteFile(tasksFilePath, data, 0644)
	if err != nil {
		fmt.Println("Erro ao salvar tarefas no arquivo:", err)
	}
}

// Carrega as tarefas do arquivo tasks.json para o "mapa" na memória
func loadTasksFromFile() {
	// Tranca o "cadeado" para garantir que ninguém tente ler/escrever ao mesmo tempo
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	fmt.Println("Carregando tarefas do arquivo...")

	// Lê o arquivo tasks.json
	data, err := os.ReadFile(tasksFilePath)

	// Se o arquivo não existe (ex: primeira vez rodando), não faz nada.
	if os.IsNotExist(err) {
		fmt.Println("Arquivo tasks.json não encontrado. Começando com lista vazia.")
		return
	}
	// Se deu outro tipo de erro
	if err != nil {
		fmt.Println("Erro ao ler arquivo de tarefas:", err)
		return
	}

	// Converte o texto JSON do arquivo de volta para o nosso "mapa" (tasks)
	err = json.Unmarshal(data, &tasks)
	if err != nil {
		fmt.Println("Erro ao converter JSON do arquivo para tarefas:", err)
	}

	fmt.Printf("Carregadas %d tarefas do arquivo.\n", len(tasks))
}
