var path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const processEnvPath = path.join(__dirname, '..', 'process.env');
const envResult = require('dotenv').config({ path: processEnvPath })
if (envResult.error) {
    console.error('Unable to parse env file: ' + envResult.error);
}

module.exports = class BooksService {

    constructor() {
        this.uri = process.env.DATABASE_URI;
        this.client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true});
    }

    async fetchBooks() {
        try {
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const records = await db.find({}).toArray();
            console.log('getAllBooks::number of records: ' + records.length);
            return JSON.stringify({success: true, books: records});
        }
        catch(err) {
            console.error('Failed to get all books: ' + err);
            response.end(JSON.stringify({success: true, books: records}));
        } 
        finally {
            this.client.close();
        }
    }

    async addBook(book) {
        try {
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const result = await db.insertOne(book);
            console.log(`${result.insertedCount} book was inserted with the _id: ${result.insertedId}`);
            return JSON.stringify({success: result.result.n > 0, book: book});
        }
        catch(err) {
            console.error('Failed to insert book: ' + book + '::Error: ' + err);
            return JSON.stringify({success: result.result.n > 0, book: book});
        }
        finally {
            await this.client.close();
        }
    }

    async editBook(book) {
        try {
            const query = {"_id": ObjectId(book.id)};
            const update = {
                $set: {
                    title: book.title,
                    author: book.author,
                    released: book.released,
                    image: book.image
                }
            };
            const options = { "upsert": false };
            
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const result = await db.updateOne(query, update, options);
            console.log(`'${book.title}' book was updated with using _id: ${book.id}`);
            return JSON.stringify({success: result.result.n > 0, book: book});
        }
        catch(err) {
            console.error('Failed to edit book: ' + book + '::Error: ' + err);
            return JSON.stringify({success: result.result.n > 0, book: book});
        }
        finally {
            await this.client.close();
        }
    }

    async deleteBook(book) {
        try {
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const result = await db.deleteOne({"_id": ObjectId(book.id)});
            console.log('Mongo delete result: ' + result);
            return JSON.stringify({success: result.result.n > 0, book: book});
        }
        catch(err) {
            console.error('Failed to insert book: ' + book + '::Error: ' + err);
            return JSON.stringify({success: result.result.n > 0, book: book});
        }
        finally {
            await this.client.close();
        }
    }
}