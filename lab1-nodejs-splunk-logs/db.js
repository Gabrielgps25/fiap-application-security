
async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: 'test',
        password: 'test',
        database: 'lab1',
        multipleStatements: true
      } );
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectUsers(){
    const conn = await connect();

    const query = `SELECT * FROM users;`;
    console.log(`Executando query: ${query}`);
    const [rows] = await conn.query(query);
    return rows;
}

async function insertUser(user){
    const conn = await connect();

    const query = "INSERT INTO users(idPessoa, nome, cpf, email) VALUES (?, ?, ?, ?);";
    console.log(`Executando query: ${query}`);
    try{
        const [rows, fields] = await conn.execute(query, [user.idPessoa, user.nome, user.cpf, user.email]);
        return rows;
    }catch(err){
        if(err.errno === 1062){
            throw {code: 500, message: 'Erro ao cadastrar usuário: Usuário já existe'};
        }else{
            throw {code: 500, message: 'Erro inesperado ao tentar cadastrar o usuário'};
        }
    }
    return rows;
}

module.exports = {selectUsers, insertUser}
