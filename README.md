# Gestão de Laudos Periciais Odontológicos

Este projeto tem como objetivo fornecer uma plataforma para a gestão de laudos periciais odontológicos. O sistema permite o cadastro e a geração de laudos, o gerenciamento de casos periciais e o armazenamento de evidências odontológicas.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução para JavaScript.
- **Express** - Framework web para Node.js.
- **MongoDB** - Banco de dados NoSQL.
- **Mongoose** - ODM (Object Data Modeling) para MongoDB.
- **Swagger** - Para documentação interativa da API.
- **dotenv** - Carregamento de variáveis de ambiente.
- **Cors** - Habilita CORS (Cross-Origin Resource Sharing) nas requisições.
- **Morgan** - Middleware de logging HTTP.
- **bcryptjs** - Biblioteca para hash de senhas.
- **jsonwebtoken (JWT)** - Para autenticação via tokens JWT.

## Funcionalidades

- **Autenticação de Usuários**: 
  - Cadastro de novos usuários (Admin, Perito, Assistente).
  - Login de usuários e emissão de tokens JWT para autenticação.

- **Gerenciamento de Casos Periciais**: 
  - Cadastro de casos periciais.
  - Visualização e filtro dos casos por status e responsável.

- **Geração de Laudos**: 
  - Geração e exportação de laudos odontológicos em PDF.

- **Upload de Evidências**: 
  - Upload de imagens (radiografias, fotografias intraorais) vinculadas aos casos.

- **Banco de Dados Odonto-Legal**:
  - Registro de pacientes identificados e não identificados.
  - Busca e comparação de registros dentários.

## Como Rodar o Projeto

### 1. Clonando o Repositório

Clone o repositório para a sua máquina local:

git clone https://github.com/usuario/gestao-laudos-periciais.git

### 2. Instalando Dependências

npm install

### 3. Configuração do Banco de Dados

Antes de rodar o projeto, você precisa configurar a conexão com o MongoDB. Crie um arquivo .env na raiz do projeto

### 4. Rodando o Servidor

npm start


### 5. Acessando a Documentação da API
A documentação interativa da API está disponível via Swagger. Acesse no seguinte endereço: http://localhost:5000/api-docs






