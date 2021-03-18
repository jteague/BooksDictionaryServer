var fs = require('fs');
var path = require('path');
const MongoClient = require('mongodb').MongoClient;
const processEnvPath = path.join(__dirname, '..', 'process.env');
const envResult = require('dotenv').config({ path: processEnvPath })
if (envResult.error) {
    console.error('Unable to parse env file: ' + envResult.error);
}

const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("sample_airbnb").collection("listingsAndReviews");
  client.close();
});