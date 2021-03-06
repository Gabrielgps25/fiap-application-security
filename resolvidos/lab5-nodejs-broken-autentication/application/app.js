var http = require('http'); 

const express = require('express') 
const app = express()
const port = 3000

const db = require("./db");
const cript = require("./cript");

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const fs   = require('fs');
const { randomUUID } = require('crypto');

var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 50, // limit each IP to 100 requests per windowMs 
    delayMs: 0, // disable delaying - full speed until the max limit is reached 
    message: "Too many accounts created from this IP, please try again after an hour"
  });

app.use(limiter);

var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port);

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get('/users', async (req, res, next) => { 
    console.log("Retornou todos usuarios!");
    var resp = await db.selectUsers()
    res.status(200).json(resp);
});

app.post('/register', async (req, res, next) => { 

    if(!req.body.username.match("^[A-Za-z0-9]{5,}")){
        return res.status(400).json({error: "Usuário Inválido", message: "Deve conter ao menos 5 caracteres entre maiúsculas, minúsculas e numéricos e caracteres especiais"});
    }

    if(!req.body.password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})")){
        return res.status(422).json({error: "A senha é muito fraca", message: "Deve conter ao menos 10 caracteres entre maiúsculas, minúsculas, numéricos e caracteres especiais"});
    }

    try{
        const users = await db.insertUser(req.body.username, cript.hash(req.body.password));
        if(users.affectedRows){ 
            console.log(`Usuário ${req.body.username} registrado com sucesso!`);
            return res.status(201).send();
        }
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.post('/login', async (req, res, next) => { 

    const users = await db.selectUserByLogin(req.body.username);

    if(users.length && cript.validate(users[0].password, req.body.password)){ 
        const user = users[0].id;
        const sub = randomUUID();
        var privateKey  = fs.readFileSync('./private.key', 'utf8');
        var token = jwt.sign({ user,sub }, privateKey, {
            expiresIn: 300,
            algorithm:  "RS256"
        });
        console.log("Fez login e gerou token!");
        return res.status(200).send({ auth: true, token: token });
    }
    console.log("Erro 401 - Unautorized!");
    return res.status(401).send('Login inválido!'); 
})    

app.post('/logout', function(req, res) { 
    console.log("Fez logout e cancelou o token!");
    res.status(200).send({ auth: false, token: null }); 
});
