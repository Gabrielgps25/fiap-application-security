var http = require('http');

const express = require('express');
const app = express();
const port = 3000;
var cors = require("cors");

const db = require("./db");

var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const fs   = require('fs');
const { randomUUID } = require('crypto');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());

app.post('/products', async (req, res, next) => { 

    try{
        const product = await db.insertProduct(req.body);
        if(product.affectedRows){ 
            console.log(`Produto ${req.body} cadastrado com sucesso!`);
            return res.status(201).send();
        }
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.get('/products', async (req, res, next) => { 

    try{
        const products = await db.getProducts();
        if(products){ 
            console.log(`Produtos retornados com sucesso!`);
            return res.status(200).send(products);
        }
        return res.status(404).send("Nenhum produto encontrado!");
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.get('/products/:id', async (req, res, next) => { 

    try{
        const [rows] = await db.getProductById(req.params.id);
        if(rows){ 
            console.log(`Produto ${req.params.id} encontrado com sucesso!`);
            return res.status(200).send(rows);
        }
        return res.status(404).send(`Produto ${req.params.id} não encontrado! :/`);
    }catch(err){
        return res.status(err.code).json(err);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})