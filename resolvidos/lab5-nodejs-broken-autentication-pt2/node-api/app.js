var http = require('http'); 

const express = require('express') 
const app = express()
const port = 3000

const db = require("./db");
const cript = require("./cript");

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');


const checkJwt = auth({
    audience: 'http://localhost:4200',
    issuerBaseURL: `https://dev-aivd9uma.us.auth0.com`,
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

const fs = require('fs');

var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
    windowMs: 15*60*1000,
    max: 50,
    delayMs: 0,
    message: "Too many accounts created from this IP, please try again after an hour"
});

app.use(limiter);

var https = require('https');
var privateKey  = fs.readFileSync('/home/gabriel/projects/aulas/fiap-application-security/resolvidos/lab5-nodejs-broken-autentication-pt2/node-api/sslcert/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('/home/gabriel/projects/aulas/fiap-application-security/resolvidos/lab5-nodejs-broken-autentication-pt2/node-api/sslcert/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port);

const checkScopes = requiredScopes('openid');

app.get('/users', checkJwt, checkScopes, async (req, res, next) => {
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

