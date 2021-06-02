const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController.js');
const bodyParser = require('body-parser');
const validator = require('./validators');
const jsonParser = bodyParser.json();

// Application Routes
router.get('/', appController.home);

// API Routes
router.get('/api/getAllBooks', appController.getAllBooks);
router.post('/api/addBook', jsonParser, validator.validateBook, appController.addBook);
router.delete('/api/deleteBook', jsonParser, validator.validateId, appController.deleteBook);
router.put('/api/editBook', jsonParser, validator.validateBook, appController.editBook);

module.exports = router;
