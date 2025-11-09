# Desafio Fullstack Veritas - Mini Kanban (React + Go)

Este é um projeto de desafio técnico para a Veritas Consultoria Empresarial, com o objetivo de construir uma aplicação Kanban fullstack, utilizando React no frontend e Go no backend.

O projeto implementa um quadro Kanban com três colunas fixas (**A Fazer**, **Em Progresso**, **Concluídas**) e permite o CRUD (Criar, Ler, Atualizar, Deletar) completo de tarefas.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

* Node.js (para o frontend)
* Go (para o backend)
* Git

---

### 1. Backend (Go)

O backend é uma API RESTful construída em Go que gerencia as tarefas.

```bash
# 1. Clone o repositório (substitua SEU-USUARIO pelo seu usuário)
git clone https://github.com/SEU-USUARIO/desafio-fullstack-veritas.git

# 2. Navegue até a pasta do backend
cd desafio-fullstack-veritas/backend

# 3. Instale as dependências
go mod tidy

# 4. Rode o servidor
go run .

# O servidor estará rodando em http://localhost:8080

2. Frontend (React)

O frontend é uma aplicação de página única (SPA) construída em React.

# Abra um NOVO terminal

# 1. Navegue até a pasta do frontend
cd desafio-fullstack-veritas/frontend

# 2. Instale as dependências do React
npm install

# 3. Inicie a aplicação
npm start

# O app abrirá automaticamente em http://localhost:3000

🛠️ Decisões Técnicas Tomadas
Para focar na entrega do MVP dentro do prazo, tomei as seguintes decisões:

Backend (Go):

    *API RESTful Pura: Utilizei a biblioteca padrão net/http do Go para criar o servidor e os endpoints RESTful (GET, POST, PUT, DELETE).

    *Persistência em JSON (Bônus): Implementei o bônus de persistência. O backend lê e salva todas as tarefas no arquivo tasks.json, garantindo que os dados não sejam perdidos ao reiniciar o servidor.

    *Validações Básicas: O backend valida se o título da tarefa é obrigatório.

    *CORS: O CORS foi configurado no backend para permitir que o frontend (rodando na porta 3000) fizesse requisições.



Frontend (React):

    *Componentização: A UI foi dividida em componentes (KanbanBoard, Column, TaskCard, NewTaskForm) para organizar o código.

    *Gerenciamento de Estado: O estado principal (a lista de tarefas) é gerenciado no componente-pai KanbanBoard.js usando os hooks useState e useEffect.

    *Comunicação com API: A função fetch() nativa do navegador é usada para todas as comunicações com o backend.

📋 Documentação
    
    User Flow: O fluxo de usuário obrigatório está localizado na pasta /docs/user-flow.png.

🛑 Limitações e Melhorias Futuras

  *Feedback de UI Básico: O feedback de erro e loading é mínimo, usando alert() nativo.

Melhorias Futuras (Bônus não implementados):

    1. Drag-and-Drop: Adicionar a funcionalidade de arrastar e soltar para mover tarefas.

    2. Testes e Docker: Adicionar testes simples e/ou Dockerfiles para facilitar o deploy.