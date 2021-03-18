const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')

// Application Routes
router.get('/', appController.home)

// API Routes
router.get('/api/books', appController.books)
router.get('/api/mongo', appController.mongo)

module.exports = router
