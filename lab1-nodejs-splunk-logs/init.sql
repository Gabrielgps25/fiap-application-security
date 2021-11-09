USE lab1;

CREATE TABLE users (
    idPessoa VARCHAR(36) UNIQUE NOT NULL,
    nome VARCHAR(50) NOT NULL,
    cpf  VARCHAR(14) NOT NULL,
    email VARCHAR(50) NOT NULL

);

INSERT INTO users (idPessoa, nome, cpf, email) VALUES ('1fa98604-1185-48b2-bffe-05b848842cda', 'Gabriel', '235.456.432-98', 'gabriel@test.com');
