const express = require('express');
const router = express.Router();
const {identifier} = require("../middlewares/identification");
const postsController = require('../controllers/postsController')

router.get('/all-posts',postsController.Post);
router.post('/create-post', identifier, postsController.createPost);
router.get('/single-post',postsController.singlePost);
router.put('/update-post', identifier, postsController.updatePost);
router.delete('/delete-post', identifier,postsController.deletePost);


module.exports = router;