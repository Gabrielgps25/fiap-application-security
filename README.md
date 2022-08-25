# fiap-application-security

## Introdução
Seja bem vindo a disciplina de Segurança de Aplicações. =)

Neste repositório existem os laboratórios que desenvolveremos em aula, a ideia é que cada um deles permita termos um contato Hands-On com os conceitos apresentados em sala. 

A estrutura deste repositório consiste em:

* Pasta `.vscode`: Pasta contendo as configurações prontas para execução e debug da aplicação através do VS Code.
* Pastas `labN-nome-do-lab`: Pasta destinada ao desenvolvimendo do lab, dentro da pasta contém os arquivos essenciais para que seja possível o hands-on explorando o conceito apresentado em aula.
* Pasta `resolvidos`: Contém as mesmas pastas de laboratórios porém aqui já resolvidos para fins de consulta e auto-correção.
* Arquivo `fiap-application-security.postman_collection.json`: Postman collection preparada para consumo das rotas presentes nos Apps visando facilitar os testes durante desenvolvimento e testes dos Laboratórios;

## Recomendações

* Prepare o ambiente instalando os softwares necessários conforme descrito na próxima sessão.
* É recomendado que você utilize o Terminal Linux/Mac ou GitBash no caso de SO Windows. Todos os comandos exemplificados consideram este ambiente.

## Preparando Ambiente

1. Baixe e instale a versão mais recente do VS Code [https://code.visualstudio.com/download](https://code.visualstudio.com/download);
2. Baixe e instale a versão LTS mais recente do Node JS [https://nodejs.org/en/download/](https://nodejs.org/en/download/);
3. Baixe e descompacte em um local de sua preferência a versão mais recente do Sqlectron [https://github.com/sqlectron/sqlectron-gui/releases](https://github.com/sqlectron/sqlectron-gui/releases) ou qualquer outro SQL Client de sua preferência;
4. Baixe e instale a versão mais recente do Postman App [https://www.postman.com/downloads/](https://www.postman.com/downloads/);
5. Caso seu sistema operacional seja Windows, intale o ambiente WSL, para isso, abra o PowerShell e execute o comando: `wsl --intall`;
6. Baixe e instale a versão mais recente do Docker [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/);

## Primeiros passos..

Para iniciar o desenvolvimento dos Labs, siga o passo a passo:

1. Clone este repositório em um local de sua preferência através do comando: 
    ```bash
    git clone https://github.com/Gabrielgps25/fiap-application-security.git
    ```
2. Abra a pasta criada através do comando:
    ```bash
    cd fiap-application-security
    ```
3. Abra a pasta no VS Code através do comando: 
    ```bash
    code .
    ```

Bom trabalho, agora você está pronto para desenvolver os Labs =)