import express from 'express';
import mongoConn from '../modules/mongo';
import fileReader from 'fs';

const cup = require('../files/defaultCupcake.json');

const conn = new mongoConn('test', 'cupcake');

const app = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.get('/', getCupCakes);
// app.get('/getDetails', getDetails);
// app.delete('/deleteDetails', deleteDetails);

async function getCupCakes(req, res) {
  res.send(cup);
}

export default app;