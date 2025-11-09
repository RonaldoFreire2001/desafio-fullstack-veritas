package main

// 3. A "Receita" (Modelo de Dados)
// Isso é uma "Struct". É o "molde" ou "receita" de como uma Tarefa deve ser.
// Toda tarefa terá esses 4 campos.
type Task struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // Vai ser "A Fazer", "Em Progresso" ou "Concluídas"
}
