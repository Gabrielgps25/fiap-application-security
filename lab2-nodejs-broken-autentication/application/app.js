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

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get('/users', verifyJWT, async (req, res, next) => { 
    console.log("Retornou todos usuarios!");
    var resp = await db.selectUsers()
    res.status(200).json(resp);
});

app.post('/register', async (req, res, next) => { 

    try{
        const users = await db.insertUser(req.body.username, req.body.password);
        if(users.affectedRows){ 
            console.log(`Usuário ${req.body.username} registrado com sucesso!`);
            return res.status(201).send();
        }
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.post('/login', async (req, res, next) => { 

    const users = await db.selectUserByLogin(req.body.username, req.body.password);
    if(users.length){ 
        const user = users[0].id;
        const sub = randomUUID();
        var privateKey  = fs.readFileSync('./private.key', 'utf8');
        var token = jwt.sign({ user,sub }, privateKey, {
            expiresIn: 300,
            algorithm:  "RS256"
        });
        console.log("Fez login e gerou token!");
        res.cookie("auth", "true");
        return res.status(200).send({ token: token });
    }

    return res.status(401).send('Login inválido!'); 
});

app.post('/logout', function(req, res) { 
    console.log("Fez logout e cancelou o token!");
    res.cookie("auth", "false").status(200).send('done'); 
});

function verifyJWT(req, res, next){ 
    var token = req.headers['authorization']; 
    if (!token)
        return res.cookie("auth", "false")
                .status(401)
                .send('Não Autorizado.');

    var publicKey  = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token.replace("Bearer ", ''), publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
        if (err)
            return res.cookie("auth", "false")
                    .status(401)
                    .send('Token inválido ou expirado.');         

        req.userId = decoded.id; 
        next(); 
    });
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })