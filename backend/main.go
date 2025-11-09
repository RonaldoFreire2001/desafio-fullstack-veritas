package main

import (
	"fmt"
	"log"
	"net/http"
)

// Esta é a função "Segurança" (Middleware) do CORS
// "Middleware" é uma função que "embrulha" outra função.
func enableCORS(next http.Handler) http.Handler {
	// "http.HandlerFunc" é um truque para transformar uma função comum em um "Handler"
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// PERMISSÕES:
		// Permite que "qualquer um" (o "*") faça pedidos
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// Permite os métodos (verbos) que nosso frontend vai usar
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		// Permite "cabeçalhos" extras (como "Content-Type")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// O "OPTIONS" é um pedido "de checagem" que o navegador faz antes do POST/PUT/DELETE
		// Se for um OPTIONS, a gente só responde "OK, pode vir" e termina.
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Se não for OPTIONS, mandamos o pedido seguir para o "garçom" (o "next")
		next.ServeHTTP(w, r)
	})
}

func main() {
	fmt.Println("O fogão está ligado! 🍳")

	// 6. O "Cardápio" (Rotas/Endpoints)

	// Criamos um "roteador" (mux)
	mux := http.NewServeMux()

	// Se o pedido for para "/tasks", chame a função "handleTasks" (que está no handlers.go)
	mux.HandleFunc("/tasks", handleTasks)
	// A função "handleNotFound" não é mais necessária, o roteador cuida disso

	// 7. Ligar o "Garçom" (Servidor)
	fmt.Println("Servidor (garçom) ouvindo pedidos na porta :8080...")

	// AQUI ESTÁ A MUDANÇA:
	// Em vez de ligar o "mux" direto, nós "embrulhamos" ele com o "enableCORS".
	// Agora, todo pedido passa primeiro no "Segurança" (CORS) antes de chegar no "Garçom" (mux).
	log.Fatal(http.ListenAndServe(":8080", enableCORS(mux)))
}
