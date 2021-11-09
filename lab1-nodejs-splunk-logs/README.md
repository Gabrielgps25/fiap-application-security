# Lab1 NodeJs SQL Injection Vulnerability

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* Postman;
* sqlectron;
* Docker (opcional).
* Splunk (necessário somente se não possuir Docker);
* MySQL (necessário somente se não possuir Docker);

## Como executar a Aplicação

### Manualmente

#### Banco de Dados

1. Executar serviço MySQL;
2. Criar um banco de dados chamado `lab1`;
3. Criar um usuário chamado `test` e senha `test`;
4. Execute o script `init.sql` para criar a estrutura básica.

#### Splunk

No Dashboard de controle do Splunk, siga o passo a passo:

1. Settings -> Data Inputs;
2. Em "HTTP Event Collector" clique em + Add new;
3. Em "name" insira o valor: "app1" e clique em Next;
4. Em "Input Settings" na sessão Index clique em "Create a new index";
5. Em "Index Name" insira "app1" e clique em "Save";
6. Em "Select Allowed Indexes" selecione o Index que acabamos de criar e clique em "Review" e em seguida em "Submit";
7. Copie o valor do "Token Value" e cole no docker-compose ou no arquivo app.js diretamente.


#### Aplicação

1. Execute o comando `npm install`;
2. Execute o comando `node app.js`.

### Usando Docker

#### Banco de Dados + Splunk + Aplicação

Através do Docker, é possível executar a aplicação e o Banco de Dados em containers, com abstração de instalação de ambiente e preparação de banco de dados.

1. Executar o comando `docker-compose up`.

#### Somente Banco de Dados
1. Executar o comando `docker-compose up db`.

#### Somente Aplicação
1. Executar o comando `docker-compose up app`.

#### Somente Splunk
1. Executar o comando `docker-compose up splunk`.

## Mascarando os logs

1. Altere a implementação de `app.js` para:
```javascript
    var payload = {
      message: {
          message: "Novo usuário cadastrado com sucesso",
          body: masked(req.body)
      },
      severity: "info"

    ...

    function masked(data){
        Object.keys(data).forEach(function(key) {
        
            if(key === "cpf"){
            data[key] = data[key].replace(/\.[0-9]{3}\.[0-9]{3}/, ".***.***");
            }else if(key === "email"){
            data[key] = data[key].replace(/.*@/, "*******@");
            }
        });
        return data;
    }
```