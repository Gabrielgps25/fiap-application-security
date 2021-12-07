const { randomUUID } = require('crypto');

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'lab7',
        multipleStatements: true
      });
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function getProducts(){
    const conn = await connect();

    const query = `SELECT * FROM products LIMIT 50;`;
    console.log(`Executando query: ${query}`);

    const [rows, fields] = await connection.execute(query);
    console.log(`Retornando: ${JSON.stringify(rows)}`);
    return rows;
}

async function getProductById(id){
    const conn = await connect();

    const query = "SELECT * FROM `products` WHERE `id` = ?;";
    console.log(`Executando query: ${query}`);

    const [rows, fields] = await connection.execute(query, [id]);

    return rows;
}

async function insertProduct(product){
    const conn = await connect();

    const query = "INSERT INTO products(id, name, value, description) VALUES (?, ?, ?, ?);";
    console.log(`Executando query: ${query}`);

    try{
        const [rows, fields] = await connection.execute(query, [randomUUID(), product.name, product.value, product.description]);
        return rows;
    }catch(err){
        if(err.errno === 1062){
            throw {code: 500, message: 'Erro ao cadastrar produto: Produto já existe'};
        }else{
            throw {code: 500, message: 'Erro inesperado ao tentar cadastrar o produto'};
        }
    }
}

module.exports = {getProducts, getProductById, insertProduct}
