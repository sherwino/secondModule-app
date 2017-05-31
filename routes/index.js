const express = require('express');
const router  = express.Router();
const Post = require('../models/post-model.js');
/* GET home page. */
router.get('/', (req, res, next) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log(req.user);
  Post.find({},(err,foundPost)=>{
    if (err) {
      next(err);
      return;
    }
    if (foundPost.length < 0) {

      res.render('index');
      return;
    }else {
      res.render('index', {post:foundPost });

    }

  });
});

module.exports = router;
