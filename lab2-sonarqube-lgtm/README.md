# Lab2 - SonarQube e LGTM

Bem vindo ao Lab 2, neste iremos explorar duas ferramentas de avaliação estática de código (SAST) que são o SonarQube e o LGTM. 

#### SonarQaube

1. Execute o comando: `docker-compose up sonar`;
2. Acesse a url padrão `localhost:9000` e efetue login com usuário `admin` e senha `admin`;
3. Será solicitado que você altere a senha, cadastre uma senha nova.
4. Vá em `Administration` -> `Configuration`, desmarque a opção `Force user authentication` e clique em `Save`. 
#### Aplicação

1. Rode os testes uniarios da aplicação `npm test`.
2. Execute o comando `node sonar-project.js`.

## LGTM

Para efetuar a análise no LGTM, siga o passo a passo abaixo: 

1. Crie um repositório público no GitHub;
2. Efetue commit e push deste  código no repo criado;
3. No LGTM, faça login com sua autenticação de preferência;
4. Vá em `Project lists`;
5. No input `Follow a project from a repository host` copie e cole o endereço do seu repositório e clique em `Follow`;
6. Neste momento, o LGTM tenta iniciar a compilação e análise do projeto;
7. Analise o relatório obtido;

## Aqua Trivy

Para efetuar a análise no Aqua, siga o passo a passo abaixo: 

8. Compile a imagem docker do projeto: `docker build . -t lab1`;
9. Execute a análise Aqua: `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy lab1`;

> Obs: Em ambiente Windows, utilize `-v //var/run/docker.sock:/var/run/docker.sock` para montar o sock docker.

### Tarefa opcional
10. melhore a implementação do código para corrigir as vulnerabilidades encontradas e reexecute os scans.
