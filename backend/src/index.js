const express = require('express');
const cors = require('cors')

const routes = require('./routes');

const app = express();
//
app.use(cors()); //permite que todas as app frontend acessem o backend
//determina quem pode aceder à nossa app.... no param podeias usar origin qual endereço pode aceder à informação
app.use(express.json()); //Converte o json para javascript
app.use(routes);
app.listen(3333);