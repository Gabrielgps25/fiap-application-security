USE lab1;

CREATE TABLE clients (
    id_pessoa VARCHAR(36) UNIQUE NOT NULL,
    nome VARCHAR(50) NOT NULL,
    cpf  VARCHAR(14) NOT NULL,
    email VARCHAR(50) NOT NULL,
    orientacao_sexual VARCHAR(10),
    permite_publicidade BOOLEAN NOT NULL
);

INSERT INTO clients (id_pessoa, nome, cpf, email, orientacao_sexual, permite_publicidade) VALUES 
('1fa98604-1185-48b2-bffe-05b848842cda', 'Gabriel Pereira da Silva', '231.452.545-98', 'gabriel@test.com', 'hetero', true),
('2e495651-1d83-a8w1-btfe-07b942802fa3', 'Bart Simpson', '365.476.839-18', 'bart@simpsons.com', null, false);