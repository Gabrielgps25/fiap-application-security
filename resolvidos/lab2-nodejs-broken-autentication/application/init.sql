USE lab2;

CREATE TABLE users (
    id VARCHAR(355) PRIMARY KEY, 
    user VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

INSERT INTO users (id, user, password) VALUES 
('1cf641f0-19a1-4699-94f6-5cc45c061ca8', 'admin', 'admin'),
('9dc5bbbd-39f2-49ec-a8c2-7294b31e9385', 'adriana', '@#$%^&'),
('aee94fdd-fa8b-46c7-a6ad-c01e0f1c567e', 'gabriel', '1qw23e'),
('5baaf173-d679-4957-b8c6-1bce40b0ccf5', 'pedro', '!@#$%^&'),
('6cfbfe6c-0151-11ec-9a03-0242ac130003', 'jorge', 'strawberry'),
('e8dfa2c3-5283-40ef-862e-dfb66f12a598', 'joana', 'roadrunner');
