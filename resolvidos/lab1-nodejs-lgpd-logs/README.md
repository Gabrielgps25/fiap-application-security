# Lab1 NodeJs SQL Injection Vulnerability

## Descrição

Neste laboratório iremos construir uma aplicação backend em NodeJS com logs aderentes a LGPD do zero. 

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* Sqlectron ou qualquer outro SQL Client de sua preferência;
* Postman ou Insomnia;
* Docker ou Podman.

* Caso você já possua estes programas instalados, pule a sessão seguinte.

## Preparando Ambiente

1. Baixe e instale a versão mais recente do VS Code [https://code.visualstudio.com/download](https://code.visualstudio.com/download);
2. Baixe e instale a versão LTS mais recente do Node JS [https://nodejs.org/en/download/](https://nodejs.org/en/download/);
3. Baixe e descompacte em um local de sua preferência a versão mais recente do Sqlectron [https://github.com/sqlectron/sqlectron-gui/releases](https://github.com/sqlectron/sqlectron-gui/releases);
4. Baixe e instale a versão mais recente do Postman App [https://www.postman.com/downloads/](https://www.postman.com/downloads/);
5. Caso seu sistema operacional seja Windows, intale o ambiente WSL, para isso, abra o PowerShell e execute o comando: `wsl --intall`;
6. Baixe e instale a versão mais recente do Docker [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/);


## Construído a Aplicação

1. Dentro da pasta `lab1-nodejs-lgpd-logs`, execute o comando `npm init`;
2. Altere as informações padrão se desejar e confirme todas as questões, feito isso, será criado o arquivo `package.json` na pasta;
3. Para criarmos rotas de API, utilizaremos o framework express, para instalar o mesmo, execute o comando: `npm install express --save`;
4. Abra a pasta atual no VS Code (dica: pode ser utilizado o comando: `code .`);
5. Crie um arquivo com o nome que você definiu na questão `entry point` (padrão: `index.js`) e inclua o conteúdo:
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


## Criando um Banco de Dados e comunicando a aplicação

1. Neste passo, iremos executar uma imagem docker para rodar um serviço de Banco de Dados MySql, para isso, execute o comando: `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=RootPassword -e MYSQL_DATABASE=Backoffice -e MYSQL_USER=MainUser -e MYSQL_PASSWORD=MainPassword docker.io/mysql`
2. No SQL Client de sua preferência, crie uma nova conexão, configure segundo os parâmetros passados no comando anterior e teste a conexão.
3. 

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