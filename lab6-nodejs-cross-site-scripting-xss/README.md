# Lab 3 - XSS Cross Site Scripting

## Ambiente

### Programas Necessários

* VS Code;
* Node JS;
* Postman;
* sqlectron;
* Docker (opcional).
* MySQL (necessário somente se não possuir Docker);
* Nginx (necessário somente se não possuir Docker);

## Executando a Aplicação

#### Parte 1 -> Frontend PHP + Nginx

1. Na pasta `frontend-php`, execute a aplicação com o comando `docker-compose up`.

#### Parte 2 -> Frontend Angular

1. Na pasta `frontend-angular`, execute a aplicação com o comando `docker-compose up`.

## Explorando Vulnerabilidades

Explore as vulnerabilidades em ambos frontends e tome nota das diferenças encontradas.

### Reflected

1. Acesse a url `http://app.localhost/reflected.php?name=XSS%20Cross%20Site%20Scripting`;
2. Repare que a tabela imprime como Nome o valor passado via query parameter;
3. O que acontece se tentarmos inserir código javascript como valor neste parâmetro?

### Stored

1. Acesse a url `http://app.localhost/stored.php`;
2. Repare que a tabela imprime os produtos que são retornados pela API e que estão presentes no banco de dados;
3. O que acontece se tentarmos cadastrar produtos na API que contenham código javascript?

### DOM based

1. Acesse a url `http://app.localhost/dom.php?search=my+text`;
2. Repare que a imagem na página utiliza o texto no atributo alt;
3. O que acontece se tentarmos inserir código javascript como valor neste parâmetro?

### Extra
https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-angularjs-expression
