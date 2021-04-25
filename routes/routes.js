const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Application Routes
router.get('/', appController.home)
router.get('/book', appController.book)

// API Routes
router.get('/api/getAllBooks', appController.getAllBooks)
router.post('/api/addBook', jsonParser, appController.addBook)
router.delete('/api/deleteBook', jsonParser, appController.deleteBook)

module.exports = router
