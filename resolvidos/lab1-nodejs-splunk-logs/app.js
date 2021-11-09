const express = require('express');
const app = express();
const port = 3000;
const db = require("./db");
const { randomUUID } = require('crypto');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

var SplunkLogger = require("splunk-logging").Logger;

var config = {
    token: process.env.SPLUNK_TOKEN || "7246f43a-25be-4a9a-afaf-ebe23c5db3b9",
    url: "https://localhost:8088"
};

var Logger = new SplunkLogger(config);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/users', async (req, res, next) => {
  const users = await db.selectUsers();
    res.send({data: users});
});

app.post('/user', async (req, res, next) => {

  try{
    var user = req.body;
    user.idPessoa = randomUUID();

    await db.insertUser(user);
    
    var payload = {
      message: {
          message: "Novo usuário cadastrado com sucesso",
          body: masked(user)
      },
      severity: "info"
  };

    Logger.send(payload, function(err, resp, body) {
      console.log("Response from Splunk", body);
    });

    res.status(201).send();
  }catch(err){
    return res.status(err.code).json(err);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

function masked(data){
  Object.keys(data).forEach(function(key) {
    
    if(key === "cpf"){
      data[key] = data[key].replace(/\.[0-9]{3}\.[0-9]{3}/, ".***.***");
    }else if(key === "email"){
      data[key] = data[key].replace(/.*@/, "*******@");
    }
  });
  return data;
}