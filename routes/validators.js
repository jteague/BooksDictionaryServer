const {check, validationResult} = require('express-validator');

exports.validateId = [
    check('id')
    .isMongoId()
    .withMessage('id must be a valid MongoDB ID')
    .bail(),

    (req, res, next) => {
        if(!req.body) {
            return res.status(422).json({success: false, errors: {error: 'request body is empty'}});
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({success: false, errors: errors.array()});
        }
        next();
    },
];

exports.validateBook = [
    check('_id')
        .optional()
        .trim()
        .isMongoId()
        .withMessage('_id must be a valid MongoDB ID')
        .bail(),
    check('title')
        .trim()
        .not()
        .isEmpty()
        .withMessage('title can not be empty')
        .bail()
        .isLength({min: 3, max: 255})
        .withMessage('title Minimum 3 characters; Maximum 255 characters')
        .bail(),
    check('author')
        .trim()
        .not()
        .isEmpty()
        .withMessage('author can not be empty')
        .bail()
        .isLength({min: 3, max: 255})
        .withMessage('author: Minimum 3 characters; Maximum 255 characters')
        .bail(),
    check('image')
        .optional()
        // .trim()
        // .isURL()
        // .withMessage('image must be a valid URL')
        // .bail()
        ,
    check('released')
        .toInt()
        .not()
        .isEmpty()
        .withMessage('released (year) can not be empty')
        .bail(),

    (req, res, next) => {
        if(!req.body) {
            return res.status(422).json({success: false, errors: {error: 'request body is empty'}});
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({success: false, errors: errors.array()});
        }
        next();
    },
];