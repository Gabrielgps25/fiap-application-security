# Lab2 - SonarQube e LGTM

Bem vindo ao Lab 2, neste iremos explorar duas ferramentas de avaliação estática de código (SAST) que são o SonarQube e o LGTM. 

#### SonarQaube

1. Execute o comando: `docker-compose up sonar`;
2. Acesse a url padrão `localhost:9000` e efetue login com usuário `admin` e senha `admin`;
3. Será solicitado que você altere a senha, cadastre uma senha nova.
4. Vá em `Administration` -> `Configuration` -> `Security`, desmarque a opção `Force user authentication` e clique em `Save`. 
#### Aplicação

1. Instale o projeto `npm i` e rode os testes unitários da aplicação `npm test`.
2. Execute o comando `node sonar-project.js`.

## Aqua Trivy

Para efetuar a análise no Aqua, siga o passo a passo abaixo: 

8. Compile a imagem docker do projeto: `docker build . -t lab2`;
9. Execute a análise Aqua: `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy image lab2`;

> Obs: Em ambiente Windows, utilize `-v //var/run/docker.sock:/var/run/docker.sock` para montar o sock docker.

### Tarefa opcional
10. melhore a implementação do código para corrigir as vulnerabilidades encontradas e reexecute os scans.
