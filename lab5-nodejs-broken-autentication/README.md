# Lab 5 - Broken Authentication

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* Postman;
* sqlectron;
* Docker (opcional).
* MySQL (necessário somente se não possuir Docker);
* Burp Suite (necessário somente se desejar explorar as vulnerabilidades).
  
## Como executar a Aplicação


### Usando Docker

#### Banco de Dados + Aplicação

Através do Docker, é possível executar a aplicação e o Banco de Dados em containers, com abstração de instalação de ambiente e preparação de banco de dados.

1. Executar o comando `docker-compose up`.

#### Somente Banco de Dados
1. Executar o comando `docker-compose up db`.

#### Somente Aplicação
1. Executar o comando `docker-compose up app`.

### Manualmente

#### Banco de Dados

1. Executar serviço MySQL;
2. Criar um banco de dados chamado `lab5`;
3. Criar um usuário chamado `test` e senha `test`;
4. Execute o script `init.sql` para criar a estrutura básica.

#### Aplicação

1. Execute o comando `npm install`;
2. Execute o comando `node app.js`.

## Explorando as vulnerabilidades

### Session Hijacking

1. Execute a aplicação e o banco de dados conforme instruções acima;
2. No Burp Suite, ative o proxy e configure o Insomnia para utiliza-lo como proxy;
3. Efetue uma chamada de Login a Aplicação simulando um usuário real fazendo login;
4. No Burp Suite, inspecione as comunicações HTTP e obtenha o cookie gerado;
5. Com o cookie gerado, consuma o endpoint protegido simulando um atacante.

### Dictionary Attack

1. Execute a aplicação e o banco de dados conforme instruções acima;
2. No bash de comando, execute o script `dictionary.sh` presente em `black-hat-env/dictionary-attack` passando os arquivos `username-list.txt` e `password-list.txt` como parâmetros, exemplo: `./dictionary.sh username-list.txt password-list.txt`;
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


### Quebra de senhas (criptografia fraca)

Para mitigar essa vulnerabilidade, utilizar a técnica de armazenamento de senhas hash COM salt para isso, siga o passo a passo:

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

4. Altere a implementação de consulta de usuário para validar o hash ao buscar o usuário do banco de dados:
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

### Aula 6 - Obtenção de Credenciais e Session Hijacking - Sniff / Man in the middle

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

### Aula 7 - Autenticação e Autorização

#### Autenticação
##### Angular App

Para implementar Autenticação e Autorização dos usuários, utilizaremos uma solução madura de mercado (auth0), que pode ser acessado em: [https://manage.auth0.com/dashboard](https://manage.auth0.com/dashboard);

1. Faça o login no Dashboard do Auth0 da forma de sua preferência e acesse `Applications`;
2. Clique em `Create Application` e em seguida defina o nome `AngularApp` e selecione o tipo `Single Page Web Applications`;
3. Em seguida clique em `Settings`;
4. Copie os valores de `Client ID` e `Domain` e guarde estes, utilizaremos mais a frente;
5. Em `Allowed Callback URLs`, `Allowed Logout URLs` e `Allowed Web Origins` adicione `http://localhost:4200`;
6. Mantenha as demais configurações default e clique em `Save Settings`;

##### Node API

Agora, na API node que implementamos, incluiremos a validação de tokens, para isso:

1. De volta ao Dashboard do Auth0, acesse `APIs` em  `Applications`;
2. Clique em `Create API` e em seguida defina o nome `users` e em identifier adicione `http://localhost:4200`;
3. Clique em `Create`;
5. Em `app.js` altere a implementação para:
   ```javascript
      const { auth } = require('express-oauth2-jwt-bearer');

      const checkJwt = auth({
         audience: 'http://localhost:4200', // Chamadores habilitados
         issuerBaseURL: `seuIssuerBase`,
      });

      app.use(function(req, res, next) {
         res.setHeader('Access-Control-Allow-Origin', '*');
         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
         res.setHeader('Access-Control-Allow-Credentials', true);
         next();
      });

      ....

      app.get('/users', checkJwt, async (req, res, next) => {
   ```
   Obs.: Não se esqueça de executar o `npm install express-oauth2-jwt-bearer`.


##### Angular SPA

1. Instale o angular cli através do comando: `npm install -g @angular/cli` e execute a aplicação com: `ng serve`;
2. Acesse a aplicação no Navegador pela URL: `http://localhost:4200`;
3. Efetue o login e acesse a aba `Profile`;
4. Efetue logout e tente acessar a rota `http://localhost:4200/profile` diretamente, repare que o acesso é bloqueado e você será redirecionado para o login;
5. Agora no arquivo `auth_config.json`:
  a. Substitua os valores de `Client ID` e `Domain`  pelos valores que você armazenou anteriormente;
  b. Substitua o valor de `audience` para o endereço do consumidor (esta propria aplicação): `http://localhost:4200`;
  c. Substitua o valores d `issuerBaseURL` para o valor do `Domain` (não esqueça de incluir o protocolo `https://`).
6. De volta a aplicação, faça a autenticação da sua preferência e acesse a aba `External API`.
7. Teste a integração clicando em `Ping API`.

* Lembre-se que nosso certificado é Auto Assinado, portanto, caso ocorra erro no passo anterior, inspecione a aba Network do Google Chrome DevTools (pode ser aberta pressionando `F12`), caso o erro seja referente a Autoridade de Certificado Inválida ou semelhante, acesse o endpoint `https://localhost:3000/users` e clique em `Avançado` e `Ir para localhost`.  

Neste momento, vemos uma autenticação de um usuário via Authorization Code com PKCE e a utilização do Token JWT gerado pelo SPA para consumir a API;
 
#### Autorização

Repare que até então, não validamos nenhuma permissão do usuário especificamente, neste momento, incluiremos uma Autorização (somente usuários autorizados a acessar determinado recurso o poderá fazer).

1. Em app.js, altere a implementação para: 
   ```javascript
   const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
   const checkScopes = requiredScopes('openid');
   ...
   app.get('/users', checkJwt, checkScopes, async (req, res, next) => {

   ``` 
2. Se necessário, restarte o processo da API;
3. Teste novamente a validação e altere o requiredScope para qualquer valor (inexistente);

Por boas praticas, para fins de um bom controle de acessos, deveríamos ter uma API BFF (Backend for Frontend que exponha APIs que tenha como objetivo servir o Front end. Este deve possuir uma credencial do tipo client_credentials e este sim sofre validação de scopes para correto controle de acesso a domínios diferentes). 
