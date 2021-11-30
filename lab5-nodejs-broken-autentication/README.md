# Lab2 Broken Authentication

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* Postman;
* sqlectron;
* Docker (opcional).
* MySQL (necessário somente se não possuir Docker);
* Wireshark (necessário somente se desejar explorar vulnerabilidades attravés de Man In The Middle).

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

## Explorando as vulnerabilidades

### Session Hijacking

1. Execute a aplicação e o banco de dados conforme instruções acima;
2. No Wireshark, inicie o tracing da interface de rede em utilização;
3. Efetue uma chamada de Login a Aplicação simulando um usuário real fazendo login;
4. No Wireshark, inspecione as comunicações HTTP e obtenha o token gerado;
5. Com o token gerado, consuma o endpoint protegido simulando um atacante.

### Dictionary Attack

1. Execute a aplicação e o banco de dados conforme instruções acima;
2. No bash de comando, execute o script `brute.sh` presente em `black-hat-env/brutal-force` passando os arquivos `username-list.txt` e `password-list.txt` como parâmetros, exemplo: `./brute.sh username-list.txt password-list.txt`;
3. Obtenha as credenciais expostas simulando um atacante. 

## Mitigando as vulnerabilidades

### Descobrimento de Credenciais - Brute force / Dictionary Attack

1. Para mitigarmos possíveis descobrimentos de credenciais através de Brute Force, na classe `app.js`, inclua um RateLimit, ex.:
   ```javascript
    var RateLimit = require('express-rate-limit');

    var limiter = new RateLimit({
        windowMs: 15*60*1000,
        max: 50,
        delayMs: 0,
        message: "Too many accounts created from this IP, please try again after an hour"
    });

    app.use(limiter);
   ```
2. Implemente políticas de cadastro de senhas fortes, na rota `register` do `app.js`, inclua:
   ```javascript
    if(!req.body.password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})")){
        return res.status(422).json({error: "A senha é muito fraca", message: "Deve conter ao menos 10 caracteres entre maiúsculas, minúsculas, numéricos e caracteres especiais"});
    }
   ```
3. Implemente logs de segurança em casos de tentativas de login mal sucedidas.

### Obtenção de Credenciais e Session Hijacking - Sniff / Man in the middle

1. Altere a implementação do server para utilizar https, para isso, no `app.js`, inclua:
   ```javascript
    var https = require('https');
    var privateKey  = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
    var certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');

    var credentials = {key: privateKey, cert: certificate};

    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(3000);
   ```
   **Observação**: Os certificados auto assinados devem ser gerados conforme ultimo laboratório.

### Quebra de senhas (criptografia fraca)

Para mitigar essa vulnerabilidade, utilizar a técnica de armazanamento de senhas hash COM salt para isso, siga o passo a passo:

1. Crie um novo arquivo `cript.js` contendo:
   ```javascript
      var crypto = require('crypto');

      var SaltLength = 9;

      function createHash(password) {
      var salt = generateSalt(SaltLength);
      var hash = md5(password + salt);
      return salt + hash;
      }

      function validateHash(hash, password) {
      var salt = hash.substr(0, SaltLength);
      var validHash = salt + md5(password + salt);
      return hash === validHash;
      }

      function generateSalt(len) {
      var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
            setLen = set.length,
            salt = '';
      for (var i = 0; i < len; i++) {
         var p = Math.floor(Math.random() * setLen);
         salt += set[p];
      }
      return salt;
      }

      function md5(string) {
      return crypto.createHash('md5').update(string).digest('hex');
      }

      module.exports = {
      'hash': createHash,
      'validate': validateHash
      };
   ```

2. No `app.js` declare-o como constante:
   ```javascript
      const cript = require("./cript");
   ```

3. Altere a implementação de cadastro de usuário para gerar o hash antes de armazena-lo no banco de dados:
   ```javascript
   const users = await db.insertUser(req.body.username, cript.hash(req.body.password));
   ```

4. Altere a implementação de consulta de usuário para validasr o hash ao buscar o usuário do banco de dados:
   ```javascript
   const users = await db.selectUserByLogin(req.body.username);
    
    if(users.length && cript.validate(users[0].password, req.body.password)){ 
   ```

5. Altere a implementação de busca no MySQL para buscar somente pelo usuário (sem senha):
   ```javascript
      async function selectUserByLogin(user){
      const conn = await connect();
      
      const query = "SELECT * FROM `users` WHERE `user` = ?;";
      console.log(`Executando query: ${query}`);
      
      const [rows, fields] = await connection.execute(query, [user]);

      return rows;
   }
   ```