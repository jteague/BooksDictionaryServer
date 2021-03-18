var fs = require('fs');
var path = require('path');
const bent = require('bent')
const getJSON = bent('json')
const MongoClient = require('mongodb').MongoClient;
const semverMajor = require('semver/functions/major')
const semverGt = require('semver/functions/gt')
const packageJson = require('../package.json')
const processEnvPath = path.join(__dirname, '..', 'process.env');
const envResult = require('dotenv').config({ path: processEnvPath })
if (envResult.error) {
    console.error('Unable to parse env file: ' + envResult.error);
}

exports.books = async (request, response) => {
    const { headers, method, url } = request;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(
        [{
            title: 'Ender\'s Game',
            author: 'Orson Scott Card',
            released: 1985,
            picture: 'http://library.jodan-design.com/wp-content/uploads/2014/01/Enders-Game-by-Orson-Scott-Card.jpg'
        },
        {
            title: 'Neuromancer ',
            author: 'William Gibson',
            released: 1984,
            picture: 'http://4.bp.blogspot.com/-ohH3XUJplA8/Ut7AX6wKD0I/AAAAAAAAJlg/CbYYKd_yzF4/s1600/361px-Neuromancer_(Book).jpg'
        }
    ]));
}

exports.mongo = async(request, response) => {
    const bedCount = request.param('beds');
    console.log('bedCount: ' + bedCount)

    const uri = process.env.DATABASE_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            logErrorAndCloseClient(err);
            return;
        }
        
        client.db("sample_airbnb").collection("listingsAndReviews").find({beds: 9}).toArray()
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

function logErrorAndCloseClient(findError, client) {
    console.error(findError);
    client.close();
}
