const express = require('express');
const app = express();
const port = 3000;
const db = require("./db");

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!'})
});

app.get('/auth', async (req, res, next) => {
  const users = await db.selectUserByLogin(req.query.user, req.query.password);
  if(users.length){
    res.send("Login Success");
  }else{
    res.send("401 - Unauthorized");
  }
});

let server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

module.exports  = server;