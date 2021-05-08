import express from 'express';
import mongoConn from '../modules/mongo';

const orders = require('../files/defaultOrders.json');

const con = new mongoConn('cupcake', 'orderListing');

const app = express.Router();
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.raw());

app.post('/', addOrders);
async function addOrders(req, res) {
  var mongo = await con.getCollection();
  var result = await mongo.insertOne(req.body);
    
  if (result.insertedCount > 0) {
    res.send({
      inserted: true,
      insertCount: result.insertedCount,
      message: `Inserted ${result.insertedCount} order${result.insertedCount > 0 ? 's' : ''}`,
      orderNo: result.insertedId
    });
  } else {
    res.send({ inserted: false, insertCount: result.insertedCount, message: `Failed to insert orders into db. Please try again.` });
  }

  con.close();
}

app.get('/', getOrders);
async function getOrders(req, res) {
  var mongo = await con.getCollection();
  var dbResult = await mongo.find();

  var result = [];
  await dbResult.forEach(r => result.push(r));

  res.send(result);

  con.close();
}

app.get('/default', insertDefaultOrders);
async function insertDefaultOrders(req, res) {
  var mongo = await con.getCollection();
  var result = await mongo.insertMany(orders);

  res.send(`Inserted ${result.insertedCount} orders!`);
}

export default app;