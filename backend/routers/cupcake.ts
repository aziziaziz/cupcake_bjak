import express from 'express';
import mongoConn from '../modules/mongo';
import mongoDB from 'mongodb';

const cup = require('../files/defaultCupcake.json');
const objID = mongoDB.ObjectID;

const listingConn = new mongoConn('cupcake', 'cupcakeListing');

const app = express.Router();
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.raw());

app.get('/', getDefaultCupCakes);
app.get('/default', insertDefaultCupcakes);
app.patch('/update', updateCupcake);
app.post('/insert', insert);
app.get('/get', getAllCupcakes);

async function getDefaultCupCakes(req, res) {
  res.send(cup);
}

async function insertDefaultCupcakes(req, res) {
  var mongo = await listingConn.getCollection();
  await mongo.deleteMany();
  var result = await mongo.insertMany(cup);

  if (result.insertedCount == cup.length) {
    res.send({ inserted: true, insertCount: result.insertedCount, message: `Successfully inserted all the default values` });
  } else {
    res.send({ inserted: false, insertCount: result.insertedCount, message: `${result.insertedCount} of ${cup.length} inserted` });
  }
}

async function updateCupcake(req, res) {
  var result = [];
  var body = req.body;
  for (var b of body) {
    var cupcake = await getCupcakeById(b['id']);
    if (cupcake) {
      var newqty = cupcake['quantity'] - b['qty'];
      var mongo = await listingConn.getCollection();
      var update = await mongo.updateOne(
        { "_id": objID(b['id']) },
        { $set: { 'quantity': newqty } }
      );

      if (update.modifiedCount > 0) {
        result.push({ updated: true, updateCount: update.modifiedCount, message: `Successfully updated ${b['id']}`, id: b['id'], newQuantity: newqty });
      } else {
        result.push({ updated: false, updateCount: update.modifiedCount, message: `An error occur while trying to update id ${b['id']}. Please try again.` });
      }
    } else {
      result.push({ updated: false, message: `Cannot find id ${b['id']}` });
    }
  }

  res.send(result);
}

async function insert(req, res) {
  var exists = await getCupcakesByName(req.body['name']);
  if (exists > 0) {
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
  
  res.send(result);
}

async function getCupcakesByName(name) {
  const mongo = await listingConn.getCollection();
  var regex = new RegExp(["", name, ""].join(""), "i");
  var result = await mongo.find({ 'name': regex });
  return await result.count();
}

async function getCupcakeById(id) {
  const mongo = await listingConn.getCollection();
  try {
    var result = await mongo.find({ '_id': objID(id) });
  } catch {
    return null;
  }

  var resultArray = [];
  await result.forEach(r => resultArray.push(r));

  if (resultArray.length > 0) {
    return resultArray[0];
  } else {
    return null;
  }
}

export default app;