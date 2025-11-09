package main

import (
	"fmt"
	"log"
	"net/http"
)

// (A função enableCORS é exatamente a mesma de antes)
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	fmt.Println("O fogão está ligado! 🍳")

	// --- MUDANÇA AQUI ---
	// Antes de ligar o "garçom", carregamos a "geladeira" do arquivo.
	loadTasksFromFile()
	// --- FIM DA MUDANÇA ---

	mux := http.NewServeMux()
	mux.HandleFunc("/tasks", handleTasks)

	fmt.Println("Servidor (garçom) ouvindo pedidos na porta :8080...")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(mux)))
}
