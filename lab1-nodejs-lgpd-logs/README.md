# Lab1 NodeJs SQL Injection Vulnerability

## Descrição

Neste laboratório iremos construir uma aplicação backend em NodeJS com logs aderentes a LGPD do zero. 

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* Sqlectron ou qualquer outro SQL Client de sua preferência;
* Postman;
* Docker.

Obs.: Caso você ainda não possua estes programas instalados, vide sessão `Preparando Ambiente` no README.md da raiz do repositório.

## Construído a Aplicação

1. Abra um terminal dentro da pasta `lab1-nodejs-lgpd-logs` e execute o comando `npm init`;
  * Altere o parâmetro entrypoint para o valor `app.js`;
2. Altere as informações padrão se desejar e confirme todas as questões, feito isso, será criado o arquivo `package.json` na pasta (aqui você ja possui um projeto NodeJS funcional);
3. Para criarmos rotas de API, utilizaremos o framework express sobre o NodeJS, para instalar o mesmo, execute o comando: `npm install express --save`;
4. Abra a pasta atual no VS Code (dica: pode ser utilizado o comando: `code .`);
5. Crie um arquivo com o nome `app.js` que você definiu na questão `entry point` e inclua o conteúdo:
    ```javascript

    const express = require('express');
    const app = express();
    const port = 3000;

    app.listen(port, () => {
      console.log(`Express em execução e aguardando requisições em http://localhost:${port}`)
    });

    app.get('/', (req, res) => {
      res.send('Hello World!')
    });

    ```
6. Após salvo o arquivo, de volta a linha de comando, execute a aplicação através do comando: `node app.js`, se tudo deu certo, você deve receber a mensagem `Express em execução e aguardando requisições em http://localhost:3000` no console.

7. Para testarmos a aplicação, através do Postman ou da linha de comando, execute uma request GET na raiz da aplicação (pode ser usado o comando `curl -s localhost:3000`), você deve receber a resposta: `Hello World!`.

Pronto, você criou sua primeira App em NodeJs com Express ! :)

## Criando rotas de inclusão e consulta de Clientes com seus respectivos logs

---
**DICA**

Para facilitar o desenvolvimento e teste da aplicação, vamos instalar o `nodemon` que é um utilitário que dispõe o live reload para mudanças efetuadas em código, no terminal execute: `npm i -g nodemon` (Caso você esteja usando Linux ou Mac, será necessária elevação de acesso com `sudo`).

Agora, você pode executar sua aplicação com `nodemon app.js` ao invés de `node app.js` e não precisa reciclar o processo manualmente a cada alteração =)

---

1. No arquivo `app.js` crie as rotas de inclusão e consumo (neste momento, ainda sem comunicação real com o Banco de Dados):
    ```javascript

      const bodyParser = require('body-parser');
      app.use(bodyParser.json());

      app.post('/clients', (req, res, next) => {

        //TODO: Implementar inclusao do cliente no banco de dados
        var result = req.body;
        console.log(`Usuário %o cadastrado com sucesso`, result)
        res.send(result);
      });

      app.get('/clients/:cpf', (req, res, next) => {

        //TODO: Implementar consulta de cliente por cpf no banco de dados
        var result = {  nome: "Gabriel Pereira da Silva", 
                        email: "gabrielgps25@teste.com",
                        cpf: 23430988332,
                        orientacao_sexual: "hetero",
                        permite_publicidade: true };
        var errResult = { status: 404, message: "Usuário não encontrado"};

        if(req.params['cpf'] === "23430988332"){
          console.log(`Usuário %o encontrado com sucesso`, result)
          return res.send(result);
        }

        console.error(`Usuário de CPF: ${req.params['cpf']} não encontrado`)
        return res.status(errResult.status).send(errResult);
        
        });
    ```
2. Salve o arquivo e o execute com o comando: `nodemon index.js`, se preferir, utilize a configuração de execução do vscode para que possa debugar.
3. Teste a aplicação através da Postman Collection disponibilizada na raiz do repo.

## Criando um Banco de Dados e preparando dados

1. Neste passo, iremos executar uma imagem docker¹ para rodar um serviço de Banco de Dados MySql, para isso, em uma nova janela terminal, execute o comando:
    ```bash
    docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=RootPassword -e MYSQL_DATABASE=Backoffice -e MYSQL_USER=MainUser -e MYSQL_PASSWORD=MainPassword docker.io/mysql
    ```
2. No SQL Client de sua preferência, crie uma nova conexão, configure segundo os parâmetros passados no comando anterior e teste a conexão.
3. Para criarmos uma estrutura básica de dados, execute os comandos:
    ```sql
    USE seuDbMySql;
    CREATE TABLE clients (
      id_pessoa VARCHAR(36) UNIQUE NOT NULL,
      nome VARCHAR(50) NOT NULL,
      cpf  VARCHAR(14) UNIQUE NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      orientacao_sexual VARCHAR(10),
      permite_publicidade BOOLEAN NOT NULL
    );

    INSERT INTO clients (id_pessoa, nome, cpf, email, orientacao_sexual, permite_publicidade) VALUES 
      ('1fa98604-1185-48b2-bffe-05b848842cda', 'Gabriel Pereira da Silva', '234.452.154-87', 'gabriel@test.com', 'hetero', true),
      ('2e495651-1d83-a8w1-btfe-07b942802fa3', 'Bart Simpson', '365.476.839-18', 'bart@simpsons.com', null, false);
    ````

¹ Caso não esteja familiarizado com docker, realize a trilha no site oficial:
  * Docker: https://docs.docker.com/build/hellobuild/
  * Docker Compose: https://docs.docker.com/compose/gettingstarted/

## Conectando a aplicação ao Banco de Dados e dado vida as rotas

1. Para conectarmos a nossa App ao Mysql, vamos instalar a dependência `mysql2`, para isso, execute o comando: `npm i --save mysql2`;
2. Crie um arquivo chamado `db.js` e inclua o código para conexão com o DB e inclusão e consulta de clientes:
    ```javascript
    async function connect(){
      if(global.connection && global.connection.state !== 'disconnected')
          return global.connection;

      const mysql = require("mysql2/promise");
      const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: 'MainUser',
          password: 'MainPassword',
          database: 'Backoffice',
          multipleStatements: true
      });
      global.connection = connection;
      return connection;
    }

    async function selectClientByCpf(cpf){
        const conn = await connect();

        const query = `SELECT * FROM clients WHERE cpf = '${cpf}';`;
        
        const [result] = await conn.query(query);
        if(result.length == 0){
          throw {statusCode: 404, message: 'Usuário não encontrado!'};    
        }
        return result[0]

    }

    async function insertClient(client){
        const conn = await connect();

        const query = `INSERT INTO clients(id_pessoa, nome, cpf, email, orientacao_sexual, permite_publicidade) VALUES
        ('${client.idPessoa}',
        '${client.nome}',
        '${client.cpf}',
        '${client.email}',
        '${client.orientacao_sexual}',
        ${client.permite_publicidade});`;
        try{
            await conn.query(query);
        }catch(err){
            if(err.errno === 1062){
                throw {statusCode: 400, message: 'Erro ao cadastrar usuário: Usuário já existe', errMessage: err.message};
            }else{
                throw {statusCode: 500, message: 'Erro inesperado ao tentar cadastrar o usuário:', errMessage: err.message};
            }
        }
    }

    module.exports = {selectClientByCpf, insertClient}
    ```
3. No arquivo `app.js`, vamos invocar as funções criadas, para isso, altere a implementação para:
    ```javascript
    const db = require("./db");
    const { randomUUID } = require('crypto');

    app.post('/clients', async (req, res, next) => {
      try {
        var client = req.body;
        client.idPessoa = randomUUID();
        await db.insertClient(client);
        console.log(`Usuário %o cadastrado com sucesso`, client)
        return res.send(client);
      } catch (err) {
        next(err);
      }

      console.log(`Usuário %o cadastrado com sucesso`, result)
      res.send(result);
    });

    app.get('/clients/:cpf', async (req, res, next) => {

      try {
        var client = await db.selectClientByCpf(req.params['cpf']);
        console.log(`Usuário %o encontrado com sucesso`, client)
        return res.send(client);
      } catch (err) {
        next(err);
      }
    });

    /* Error handler middleware */
    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      console.error(err.message, err.errMessage);
      res.status(statusCode).json({ message: err.message });
    });
    ```
4. Teste a aplicação novamente através do Postman.

## Mascarando os logs

Para tornar a nossa aplicação aderente a LGPD, um dos principais cuidados que devemos tomar é em relação aos logs das aplicações, estes não podem em hipótese alguma expor informações dos usuários (vedado o caso de poucas informações pessoais afins de auditoria e troubleshooting sendo o acesso para tais logs controlados). 

1. Crie um arquivo chamado `utils.js` e nele adicione uma função de mascaramento:
    ```javascript
      function masked(data){
        let obj = Object.assign({}, data)
        Object.keys(obj).forEach(function(key) {
        
            if(key === "cpf"){
                obj[key] = obj[key].replace(/\.[0-9]{3}\.[0-9]{3}/, ".***.***");
            }else if(key === "email"){
                obj[key] = obj[key].replace(/.*@/, "*******@");
            }else if(key === "orientacao_sexual" && obj[key] != null){
                obj[key] = obj[key].replace(/.*/, "****");
            }
        });
        return obj;
    }

    function logInfo(message, body){
        var payload = {
            message: message,
            body: masked(body),
            severity: "info"
      }
      console.log(JSON.stringify(payload))
    }

    module.exports = {logInfo}
    ```

2. Nos arquivos `app.js`, altere os logs para invocar uma função de mascaramento:
```javascript
    const utils = require("./utils");

    utils.logInfo("Novo usuário cadastrado com sucesso", client)
```

## Containerizando a aplicação

Visando abstrair a infraestrutura da Aplicação e do banco de dados, vamos gerar uma imagem docker para executar nossa aplicação e através do Docker Compose, orquestrar os containers do Banco de Dados e da aplicação.

1. Crie um arquivo chamado `Dockerfile` contendo o passo a passo para compilação e execução da aplicação:
```bash
  FROM node:14.17.4-alpine
  EXPOSE 3000

  WORKDIR /home/app

  COPY . /home/app

  RUN npm i express \ 
      && npm i mysql2

  CMD node app.js
```

2. Para testar, vamos compilar a imagem através do comando: `docker build . -t lab1` e executar a aplicação em um container com `docker run -p3000:3000 -e DB_HOST=172.17.0.1 lab1`;

---
**OBSERVAÇÃO**

Repare que se torna bastante trabalhoso gerenciar os containers manualmente, e considerando que estamos em um cenário pequeno com apenas 2 containers, imagine gerenciarmos manualmente um ambiente com 20 containers, impossível não é?!

Podemos ir além e utilizar um orquestrador de containers, que evita que tenhamos de compilar, iniciar, parar e deletar os containers, ele mesmo gerencia o ambiente para nós. Neste este exemplo utilizaremos o docker compose, porém existem diversos no mercado como o Kubernetes ou o Amazon ECS.
---

3. Crie um arquivo novo chamado `docker-compose.yml` e inclua o conteúdo:

```yaml
version: "3"
services:
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: P4SSW0rD
      MYSQL_USER: test
      MYSQL_PASSWORD: test
      MYSQL_DATABASE: lab1
    ports:
      - "3306:3306"

  app:
    build: .
    depends_on:
      - db
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
```
4. Teste o ambiente executando o comando `docker-compose up`; (garanta que os 2 containers estejam parados para não ocorrer erro de bind de portas), ao consumir a aplicação, você deve receber um erro pois a tabela ainda não existe;

Até aqui, o docker-compose já é o suficiente para subirmos ambos containers, porém, desta forma, o banco de dados está vazio e teríamos de popular ele manualmente, oque não faz muito sentido, portanto, delegaremos a criação da estrutura do banco de dados ao docker-compose também, para isso:

5. Crie um aquivo chamado `init.sql` na raiz do projeto e inclua o conteúdo igual ao que utilizamos na sessão `Criando um Banco de Dados e preparando dados`:  
```sql
USE seuSqlDb;

CREATE TABLE clients (
    id_pessoa VARCHAR(36) UNIQUE NOT NULL,
    nome VARCHAR(50) NOT NULL,
    cpf  VARCHAR(14) NOT NULL,
    email VARCHAR(50) NOT NULL,
    orientacao_sexual VARCHAR(10),
    permite_publicidade BOOLEAN NOT NULL
);

INSERT INTO clients (id_pessoa, nome, cpf, email, orientacao_sexual, permite_publicidade) VALUES 
('1fa98604-1185-48b2-bffe-05b848842cda', 'Gabriel Pereira da Silva', '231.452.545-98', 'gabriel@test.com', 'hetero', true),
('2e495651-1d83-a8w1-btfe-07b942802fa3', 'Bart Simpson', '365.476.839-18', 'bart@simpsons.com', null, false);

```

6. A imagem docker `mysql` que estamos utilizando, considera e executa os scripts da pasta `docker-entrypoint-initdb.d` do container ao iniciar a primeira execução do banco, portanto, mapearemos o arquivo que criamos dentro do container através de um volume, para isso, inclua no serviço `db` do arquiuvo `docker-compose.yml`:

    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

7. Vamos deletar os containers criados pela execução anterior do docker-compose para forçar a recriação do banco de dados, para isso, execute os comandos: 

```bash
docker container prune
docker volume prune
```

8. Execute o ambiente novamente com `docker-compose up` e teste a aplicação. 

Parabéns, você concluiu o primeiro lab :) 
