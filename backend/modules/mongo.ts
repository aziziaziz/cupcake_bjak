import mongo from 'mongodb';

const mongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017";
var client = null;

class mongoConnect {
  db: String;
  collection: String;

  constructor(dbName: String, collectionName: String) {
    this.db = dbName;
    this.collection = collectionName;
  }

  async getCollection() {
    try {
      client = new mongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const database = client.db(this.db);
      return database.collection(this.collection);
    } catch (e) {
      client.close();
      return null;
    }
  }

  close() {
    client.close();
  }
}

export default mongoConnect;