var fs = require('fs');
var path = require('path');
const bent = require('bent')
const getJSON = bent('json')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const semverMajor = require('semver/functions/major')
const semverGt = require('semver/functions/gt')
const packageJson = require('../package.json');
const { param } = require('../routes/routes');
const processEnvPath = path.join(__dirname, '..', 'process.env');
const envResult = require('dotenv').config({ path: processEnvPath })
if (envResult.error) {
    console.error('Unable to parse env file: ' + envResult.error);
}

exports.getAllBooks = async (request, response) => {
    const uri = process.env.DATABASE_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            logErrorAndCloseClient(err);
            return;
        }
        
        client.db("books_dictionary").collection("books").find({}).toArray()
        .then((records, findError) => {
            if (findError) {
                logErrorAndCloseClient(findError, client);
                return;
            }
            if (records) {
                console.log("Found the following records: " + records.length);
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(records));
                client.close();
            }
        });
    });
}

exports.viewBook = async(request, response) => {
    const uri = process.env.DATABASE_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            logErrorAndCloseClient(err);
            return;
        }
        
        let find = client.db("books_dictionary").collection("books").find({});
        if (request.param('id')) {
            find = client.db("books_dictionary").collection("books").findOne({_id: ObjectId(request.param('id'))});
        }
        else if (request.param('title')) {
            find = client.db("books_dictionary").collection("books").find({title: request.param('title')});
        }
        else if (request.param('author')) {
            find = client.db("books_dictionary").collection("books").find({author: request.param('author')});
        }
        else if (request.param('released')) {
            find = client.db("books_dictionary").collection("books").find({released: 1985});
        }

        find.toArray()
        .then((records, findError) => {
            if (findError) {
                logErrorAndCloseClient(findError, client);
                return;
            }
            if (records) {
                console.log("Found the following records: " + records.length);
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(records));
                client.close();
            }
        });
    });
}

exports.home = (req, res) => {
    res.render('home.hbs')
}

exports.addBook = (req, res) => {
    res.render('addBook.hbs')
}

exports.book = (req, res) => {
    res.render('book.hbs')
}

function logErrorAndCloseClient(findError, client) {
    console.error(findError);
    client.close();
}
