import express from 'express';
import mongoConn from '../modules/mongo';

const cup = require('../files/defaultCupcake.json');

const listingConn = new mongoConn('cupcake', 'cupcakeListing');

const app = express.Router();
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.raw());

app.get('/', getDefaultCupCakes);
app.post('/insert', insert);
app.get('/get', getAllCupcakes);

async function getDefaultCupCakes(req, res) {
  res.send(cup);
}

async function insert(req, res) {
  var currentUser = await getAllCupcakes(null, null);
  var hasUser = currentUser.filter(c => c['name'].toLowerCase() == req.body['name'].toLowerCase());
  if (hasUser.length > 0) {
    res.status(400);
    res.send({ inserted: false, insertCount: 0, message: `Cannot insert ${req.body['name']}. ${req.body['name']} already exist.` });
  } else {
    var mongo = await listingConn.getCollection();
    var result = await mongo.insertOne(req.body);
    
    if (result.insertedCount > 0) {
      res.send({ inserted: true, insertCount: result.insertedCount, message: `Inserted ${result.insertedCount} cupcake${result.insertedCount > 0 ? 's' : ''}` });
    } else {
      res.send({ inserted: false, insertCount: result.insertedCount, message: `Failed to insert cupcake into db. Please try again.` });
    }
  }
}

async function getAllCupcakes(req, res) {
  const mongo = await listingConn.getCollection();
  var dbResult = await mongo.find();

  var result = [];
  await dbResult.forEach(r => result.push(r));
  // result.forEach(r => delete r['_id']);

  if (res) {
    res.send(result);
  } else {
    return result;
  }
}

export default app;