const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')

// Application Routes
router.get('/', appController.home)
router.get('/book', appController.book)
router.get('/addBook', appController.addBook)

// API Routes
router.get('/api/getAllBooks', appController.getAllBooks)
router.get('/api/viewBook', appController.viewBook)

module.exports = router
