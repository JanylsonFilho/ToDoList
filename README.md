# Projeto: Aplicativo de Lista de Tarefas (To-Do App)

Este é um aplicativo de lista de tarefas completo (Fullstack) desenvolvido para auxiliar na organização de atividades de forma eficiente. Ele oferece uma interface de usuário intuitiva no frontend e um robusto backend para gerenciamento e persistência de dados.

## Descrição Geral

O projeto consiste em um sistema de lista de tarefas que permite aos usuários criar, visualizar, editar e excluir suas atividades. Ele inclui funcionalidades avançadas como atribuição de prioridade, definição de prazos, anexos de arquivos e um dashboard de estatísticas para acompanhar o progresso. A arquitetura é construída com uma API RESTful no backend e um frontend SPA (Single Page Application) desenvolvido com tecnologias web padrão.

## Tecnologias Utilizadas

### Backend (Node.js)

- Node.js: Plataforma de execução JavaScript.  
- Express.js: Framework web para construção da API RESTful.  
- MongoDB: Banco de dados NoSQL para armazenamento das tarefas.  
- Mongoose: ODM (Object Data Modeling) para Node.js, facilitando a interação com o MongoDB.  
- Multer: Middleware para tratamento de upload de arquivos.  
- dotenv: Para gerenciamento de variáveis de ambiente.  
- cors: Para habilitar requisições de diferentes origens.  

### Frontend (HTML, CSS, JavaScript Puro)

- HTML5: Estruturação do conteúdo da página.  
- CSS3: Estilização e design responsivo da aplicação.  
- JavaScript (ES6+): Lógica de interação, manipulação do DOM e comunicação com a API.  
- Font Awesome: Biblioteca de ícones para a interface do usuário.  

## Funcionalidades Implementadas

- Gerenciamento Completo de Tarefas (CRUD): Os usuários podem criar novas tarefas, visualizar a lista existente, editar detalhes de tarefas e excluí-las.  
- Definição de Atributos da Tarefa: Cada tarefa pode ter um título, descrição, prioridade (baixa, média, alta) e uma data limite.  
- Controle de Status: Tarefas podem ser marcadas como concluídas ou reativadas, refletindo seu progresso.  
- Upload de Anexos: Possibilidade de anexar arquivos (imagens, PDFs, documentos de texto) às tarefas, com validação de tipo e tamanho de arquivo (máximo de 5MB).  
- Dashboard de Estatísticas: Um painel visual que exibe o número total de tarefas, tarefas ativas, tarefas concluídas, tarefas vencidas e a taxa de conclusão geral, fornecendo uma visão clara do status das atividades.  
- Filtros de Visualização: Capacidade de filtrar a lista de tarefas por status (todas, ativas, concluídas).  
- Funcionalidade de Busca: Pesquisa de tarefas por título ou descrição para facilitar a localização.  
- Paginação: Implementação de paginação para gerenciar grandes volumes de tarefas, com controle de itens por página.  
- Notificações e Modais: Mensagens de feedback (toasts) para ações do usuário e modais de confirmação para operações críticas.  
- Tratamento de Erros: Erros no backend são tratados de forma centralizada, fornecendo mensagens claras para o frontend.  

## Estrutura do Projeto

O projeto é organizado em duas pastas principais:

### client/

Contém todos os arquivos do frontend, incluindo:

- index.html  
- css/style.css  
- js/: lógica JavaScript modularizada (separando utilitários, serviços de API e componentes de UI)  

### server/

Contém todo o código do backend, incluindo:

- app.js: Configuração principal do Express.  
- config/: Configurações do banco de dados.  
- dao/: Camada de acesso a dados (DAO) para interação com o MongoDB.  
- middleware/: Middleware de tratamento de erros global.  
- models/: Definição do esquema da tarefa com Mongoose.  
- routes/: Definição das rotas da API e configuração do Multer.  
- services/: Lógica de negócio e validações.  
- uploads/: Diretório para armazenamento de arquivos anexados às tarefas (ignorado pelo controle de versão).  
- server.js: Ponto de entrada da aplicação backend.  

## Como Executar o Projeto

### Pré-requisitos:

- Node.js (versão 16.20.1 ou superior)  
- MongoDB (instalado localmente ou acesso a um cluster em nuvem)  

### Instalação das Dependências:

Navegue até o diretório raiz do projeto (ToDoList/) no seu terminal e execute:

```
npm install
# ou
npm run install-deps
```

### Configuração das Variáveis de Ambiente:

Crie um arquivo `.env` na pasta `server/` (ao lado de `server.js`) e adicione as seguintes variáveis:

```
MONGO_URI=sua_string_de_conexao_mongodb
PORT=3000
MAX_FILE_SIZE=5242880 # 5 MB em bytes
```

Substitua `sua_string_de_conexao_mongodb` pela URI de conexão do seu banco de dados MongoDB.

### Rodando a Aplicação:

No terminal, a partir do diretório raiz do projeto (ToDoList/), execute:

```
npm start
```

Ou para modo de desenvolvimento (com nodemon para restart automático):

```
npm run dev
```

O servidor será iniciado e o aplicativo estará acessível em `http://localhost:3000` (ou na porta que você configurou). A API estará disponível em `http://localhost:3000/api/tasks`.
