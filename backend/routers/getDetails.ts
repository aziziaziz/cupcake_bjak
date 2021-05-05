import express from 'express';
import mongoConn from '../modules/mongo';

const conn = new mongoConn('test', 'user');

const app = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.post('/insertDetails', insertDetails);
app.get('/getDetails', getDetails);
app.delete('/deleteDetails', deleteDetails);

async function insertDetails(req, res) {
  var currentUser = await getDetails(null, null);
  var hasUser = currentUser.filter(c => c['name'] == req.body['name']);
  if (hasUser.length > 0) {
    res.send({ inserted: false, insertCount: 0, message: `Cannot insert user. User with name ${req.body['name']} exists.` });
  } else {
    var mongo = await conn.getCollection();
    var result = await mongo.insertOne(req.body);
    
    if (result.insertedCount > 0) {
      res.send({ inserted: true, insertCount: result.insertedCount, message: `Inserted ${result.insertedCount} item${result.insertedCount > 0 ? 's' : ''}` });
    } else {
      res.send({ inserted: false, insertCount: result.insertedCount, message: `Failed to insert to db. Please try again.` });
    }
  }
}

async function getDetails(req, res) {
  const mongo = await conn.getCollection();
  var dbResult = await mongo.find();

  var result = [];
  await dbResult.forEach(r => result.push(r));
  result.forEach(r => delete r['_id']);

  if (res) {
    res.send(result);
  } else {
    return result;
  }
}

async function deleteDetails(req, res) {
  const mongo = await conn.getCollection();
  var dbResult = await mongo.deleteMany(req.query);
  
  if (dbResult.deletedCount  > 0) {
    res.send({ deleted: true, deleteCount: dbResult.deletedCount, message: `Deleted ${dbResult.insertedCount} item${dbResult.insertedCount > 0 ? 's' : ''}` });
  } else {
    res.send({ deleted: false, deleteCount: 0, message: `Failed to delete from the db. Please try again` });
  }
}

export default app;