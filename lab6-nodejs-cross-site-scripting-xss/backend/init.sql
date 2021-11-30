USE lab6;

CREATE TABLE products(
    id VARCHAR(355) PRIMARY KEY, 
    name VARCHAR(50) UNIQUE NOT NULL,
    value FLOAT NOT NULL,
    description VARCHAR(2000)
);

INSERT INTO products (id, name, value, description) VALUES 
('1cf641f0-19a1-4699-94f6-5cc45c061ca8', 'caneca', 20.5, "Linda caneca Azul"),
('9dc5bbbd-39f2-49ec-a8c2-7294b31e9385', 'Mochila', 200, 'Mochila Black');
