var http = require('http');

const express = require('express');
const app = express();
const port = 3000;

const db = require("./db");

var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const { randomUUID } = require('crypto');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get('/users', async (req, res, next) => {
    if(req.cookies["auth"] !== "true"){
        return res.status(401).send();  
    }
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
        console.log("Fez login e gerou token!");
        res.cookie("auth", "true");
        return res.status(200).send();
    }

    return res.status(401).send('Login inválido!');
});

app.post('/logout', function(req, res) {
    console.log("Fez logout e cancelou o token!");
    res.cookie("auth", "false").status(200).send('done');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
