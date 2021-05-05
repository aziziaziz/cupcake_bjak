import mongo from 'mongodb';

const mongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017";
const client = new mongoClient(url, { useUnifiedTopology: true });

var db = null;
var collection = null;

class mongoConnect {
  constructor(dbName: String, collectionName: String) {
    db = dbName;
    collection = collectionName;
  }

  async getCollection() {
    try {
      await client.connect();
      const database = client.db(db);
      return database.collection(collection);
    } catch (e) {
      client.close();
      return null;
    }
  }
}

export default mongoConnect;