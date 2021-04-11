var path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { param } = require('../routes/routes');
const processEnvPath = path.join(__dirname, '..', 'process.env');
const envResult = require('dotenv').config({ path: processEnvPath })
if (envResult.error) {
    console.error('Unable to parse env file: ' + envResult.error);
}

exports.getAllBooks = async (request, response) => {
    const uri = process.env.DATABASE_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db("books_dictionary");
        const books = db.collection("books");
        const records = await books.find({}).toArray();

        console.log('getAllBooks::number of records: ' + records.length);
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(records));
    } 
    catch(err) {
        console.error('Failed to get all books: ' + err);
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({}));
    } 
    finally {
        client.close();
    }
}

exports.addBook = async (request, response) => {

    if (!request.body) {
        console.error('Failed to insert book: no body in request');
        response.setHeader('Content-Type', 'application/json');
        response.end({result: false, message: 'no body in request'});
        return;
    }

    // todo: clean the inputs before adding to the DB
    var book = request.body;

    const uri = process.env.DATABASE_URI;
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        const db = client.db("books_dictionary");
        const books = db.collection("books");
        const result = await books.insertOne(book);
        console.log(`${result.insertedCount} books were inserted with the _id: ${result.insertedId}`);
    }
    catch(err) {
        console.error('Failed to insert book: ' + book);
    }
    finally {
        await client.close();
    }
}

exports.home = (req, res) => {
    res.render('home.hbs')
}

exports.book = (req, res) => {
    res.render('book.hbs')
}
