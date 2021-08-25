var http = require('http');

const express = require('express');
const app = express();
const port = 3000;

const db = require("./db");

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const fs   = require('fs');
const { randomUUID } = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/users', verifyJWT, async (req, res, next) => { 
    console.log("Retornou todos usuarios!");
    var resp = await db.selectUsers()
    res.status(200).json(resp);
});

app.post('/login', async (req, res, next) => { 

    const users = await db.selectUserByLogin(req.body.username, req.body.password);
    if(users.length){ 
        const user = users[0].id;
        const sub = randomUUID();
        var privateKey  = fs.readFileSync('./lab2-nodejs-broken-autentication/application/private.key', 'utf8');
        var token = jwt.sign({ user,sub }, privateKey, {
            expiresIn: 300,
            algorithm:  "RS256"
        });
        console.log("Fez login e gerou token!");
        return res.status(200).send({ auth: true, token: token });
    }
    console.log("Erro 401 - Unautorized!");
    return res.status(401).send('Login inválido!'); 
});

app.post('/logout', function(req, res) { 
    console.log("Fez logout e cancelou o token!");
    res.status(200).send({ auth: false, token: null }); 
});

function verifyJWT(req, res, next){ 
    var token = req.headers['authorization']; 
    if (!token) 
        return res.status(401).send({ auth: false, message: 'Não Autorizado.' });

    var publicKey  = fs.readFileSync('./lab2-nodejs-broken-autentication/application/public.key', 'utf8');
    jwt.verify(token.replace("Bearer ", ''), publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
        if (err) 
            return res.status(401).send({ auth: false, message: 'Token inválido ou expirado.' });         
        req.userId = decoded.id; 
        console.log("User Id: " + decoded.id)
        next(); 
    });
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});