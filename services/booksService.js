var path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const sanitize = require('mongo-sanitize');
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

    sanitizeBook(book) {
        let newBook = {};
        if (book.id) {
            newBook = {
                id: sanitize(book.id),
                title: sanitize(book.title),
                author: sanitize(book.author),
                released: sanitize(book.released),
                image: sanitize(book.image),
            }
        } else {
            newBook = {
                title: sanitize(book.title),
                author: sanitize(book.author),
                released: sanitize(book.released),
                image: sanitize(book.image),
            }
        }

        return newBook;
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
            response.end(JSON.stringify({success: false, books: null}));
        }
        finally {
            this.client.close();
        }
    }

    async addBook(book) {
        try {
            var cleanBook = this.sanitizeBook(book);
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const result = await db.insertOne(cleanBook);
            console.log(`${result.insertedCount} book was inserted with the _id: ${result.insertedId}`);
            return JSON.stringify({success: result.result.n > 0, book: cleanBook});
        }
        catch(err) {
            console.error('Failed to insert book: ' + cleanBook + '::Error: ' + err);
            return JSON.stringify({success: false, book: cleanBook});
        }
        finally {
            await this.client.close();
        }
    }

    async editBook(book) {
        try {
            var cleanBook = this.sanitizeBook(book);

            const query = {"_id": ObjectId(cleanBook.id)};
            const update = {
                $set: {
                    title: cleanBook.title,
                    author: cleanBook.author,
                    released: cleanBook.released,
                    image: cleanBook.image
                }
            };
            const options = { "upsert": false };
            
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const result = await db.updateOne(query, update, options);
            console.log(`'${cleanBook.title}' book was updated with using _id: ${cleanBook.id}`);
            return JSON.stringify({success: result.result.n > 0, book: cleanBook});
        }
        catch(err) {
            console.error('Failed to edit book: ' + cleanBook + '::Error: ' + err);
            return JSON.stringify({success: false, book: cleanBook});
        }
        finally {
            await this.client.close();
        }
    }

    async deleteBook(bookId) {
        try {
            var cleanId = sanitize(bookId);
            await this.client.connect();
            const db = this.client.db("books_dictionary").collection("books");
            const result = await db.deleteOne({"_id": new ObjectId(cleanId.id)});
            console.log('Mongo delete result: ' + result);
            return JSON.stringify({success: result.result.n > 0, book: cleanId});
        }
        catch(err) {
            console.error('Failed to delete book: ' + cleanId + '::Error: ' + err);
            return JSON.stringify({success: false, book: cleanId, msg: err.toString()});
        }
        finally {
            await this.client.close();
        }
    }
}