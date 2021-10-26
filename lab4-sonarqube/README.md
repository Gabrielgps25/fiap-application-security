# Lab4 SonarQube

## Ambiente

### Programas Necessários

* Node JS;
* Docker (opcional).
* SonarQube Server (necessário somente se não possuir Docker);

## Como executar o Sonar

### Manualmente

#### SonarQaube

1. Abra a pasta `bin` do seu SonarQube;
2. Execute o executavel adequado para seu SO, ex.: `sonar.sh`;
3. Acesse a url padrão `localhost:9000` e efetue login com usuário `admin` e senha `admin`;
4. Será solicitado que você altere a senha, cadastre uma senha nova;
5. Vá em `Administration` -> `Configuration`, desmarque a opção `Force user authentication` e clique em `Save`. 

#### Aplicação

1. Execute o comando `node sonar-project.js`.

### Usando Docker

#### SonarQaube

1. Execute o comando: `docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest`;
2. Acesse a url padrão `localhost:9000` e efetue login com usuário `admin` e senha `admin`;
3. Será solicitado que você altere a senha, cadastre uma senha nova.

#### Aplicação

1. Execute o comando `node sonar-project.js`.
