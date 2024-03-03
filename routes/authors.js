const express = require('express');
const router = express.Router();
const {verifyTokenAndAuthorization } = require('../middlewares/verifyToken')
const {
    authorLogin,
    authorRegester,
    allAuthor,
    singleAuthor,
    deleteAuthor,
    updateAuthor
} = require('../controllers/authorController')

router.post('/login', authorLogin)

router.route('/')
    .get(allAuthor)
    .post(authorRegester)
    
router.route('/:id')
    .get(verifyTokenAndAuthorization, singleAuthor)
    .put(verifyTokenAndAuthorization, updateAuthor)
    .delete(verifyTokenAndAuthorization, deleteAuthor)
module.exports = router;