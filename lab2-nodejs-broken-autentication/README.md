# Lab2 Broken Authentication

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* MySQL;
* Postman;
* sqlectron;
* Docker (opcional).

## Como executar a Aplicação

### Manualmente

#### Banco de Dados

1. Executar serviço MySQL;
2. Criar um banco de dados chamado `lab2`;
3. Criar um usuário chamado `test` e senha `test`;
4. Execute o script `init.sql` para criar a estrutura básica.

#### Aplicação

1. Execute o comando `npm install`;
2. Execute o comando `node app.js`.

### Usando Docker

#### Banco de Dados + Aplicação

Através do Docker, é possível executar a aplicação e o Banco de Dados em containers, com abstração de instalação de ambiente e preparação de banco de dados.

1. Executar o comando `docker-compose up`.

#### Somente Banco de Dados
1. Executar o comando `docker-compose up db`.

#### Somente Aplicação
1. Executar o comando `docker-compose up app`.