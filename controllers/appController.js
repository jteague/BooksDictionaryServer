var path = require('path');
const BooksService = require('../services/booksService.js');
const processEnvPath = path.join(__dirname, '..', 'process.env');
const envResult = require('dotenv').config({ path: processEnvPath })
if (envResult.error) {
    console.error('Unable to parse env file: ' + envResult.error);
}

exports.getAllBooks = async (request, response) => {
    var booksService = new BooksService();
    const result = await booksService.fetchBooks();
    response.setHeader('Content-Type', 'application/json');
    if (result.success === true) {
        response.status = 200;
        response.end(result);
    } else {
        response.status = 500;
        response.end(result);
    }
}

exports.addBook = async (request, response) => {

    if (!request.body) {
        console.error('Failed to insert book: no body in request');
        response.setHeader('Content-Type', 'application/json');
        response.end({result: false, message: 'no body in request'});
        return;
    }

    var book = request.body;
    var booksService = new BooksService();
    const result = await booksService.addBook(book);
    response.setHeader('Content-Type', 'application/json');
    if (result.success === true) {
        response.status = 200;
        response.end(result);
    } else {
        response.status = 500;
        response.end(result);
    }
}

exports.deleteBook = async (request, response) => {
    if (!request.body) {
        console.error('Failed to delete book: no body in request');
        response.setHeader('Content-Type', 'application/json');
        response.end({result: false, message: 'no body in request'});
        return;
    }

    var id = request.body;

    var booksService = new BooksService();
    const result = await booksService.deleteBook(id);
    response.setHeader('Content-Type', 'application/json');
    if (result.success === true) {
        response.status = 200;
        response.end(result);
    } else {
        response.status = 500;
        response.end(result);
    }
}

exports.editBook = async (request, response) => {

    if (!request.body) {
        console.error('Failed to edit book: no body in request');
        response.setHeader('Content-Type', 'application/json');
        response.end({result: false, message: 'no body in request'});
        return;
    }

    var book = request.body;
    var booksService = new BooksService();
    const result = await booksService.editBook(book);
    response.setHeader('Content-Type', 'application/json');
    if (result.success === true) {
        response.status = 200;
        response.end(result);
    } else {
        response.status = 500;
        response.end(result);
    }
}

exports.home = (req, res) => {
    res.render('home.hbs')
}

exports.book = (req, res) => {
    res.render('book.hbs')
}
