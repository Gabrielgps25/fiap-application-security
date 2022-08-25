const express = require('express');
const app = express();
const port = 3000;
const db = require("./db");
const utils = require("./utils");

const { randomUUID } = require('crypto');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Express em execução e aguardando requisições em http://localhost:${port}`)
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.post('/clients', async (req, res, next) => {

  try {
    var client = req.body;
    client.idPessoa = randomUUID();
    await db.insertClient(client);

    utils.logInfo("Novo usuário cadastrado com sucesso", client)

    return res.send(client);
  } catch (err) {
    next(err);
  }
});

app.get('/clients/:cpf', async (req, res, next) => {

  try {
    var client = await db.selectClientByCpf(req.params['cpf']);
    console.log(`Usuário %o encontrado com sucesso`, client)
    return res.send(client);
  } catch (err) {
    next(err);
  }
});

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.errMessage);
  res.status(statusCode).json({ message: err.message });
});