async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: 'MainUser',
        password: 'MainPassword',
        database: 'lab1',
        multipleStatements: true
      } );
    global.connection = connection;
    return connection;
}

async function selectClientByCpf(cpf){
    const conn = await connect();

    const query = `SELECT * FROM clients WHERE cpf = '${cpf}';`;
    
    const [result] = await conn.query(query);
    if(result.length == 0){
        throw {statusCode: 404, message: 'Usuário não encontrado!'};    
    }
    return result

}

async function insertClient(client){
    const conn = await connect();

    const query = `INSERT INTO clients(id_pessoa, nome, cpf, email, orientacao_sexual, permite_publicidade) VALUES
    ('${client.idPessoa}',
     '${client.nome}',
     '${client.cpf}',
     '${client.email}',
     '${client.orientacao_sexual}',
     ${client.permite_publicidade});`;
    try{
        await conn.query(query);
    }catch(err){
        if(err.errno === 1062){
            throw {statusCode: 400, message: 'Erro ao cadastrar usuário: Usuário já existe', errMessage: err.message};
        }else{
            throw {statusCode: 500, message: 'Erro inesperado ao tentar cadastrar o usuário:', errMessage: err.message};
        }
    }
}

module.exports = {selectClientByCpf, insertClient}