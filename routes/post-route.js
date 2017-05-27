const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/post-model.js');
const comment = require('../models/comment-post.js');

const ensure = require('connect-ensure-login');

router.get('/posts/new',
  (req, res, next) => {
    console.log('-------');
    res.render('posts/new-post.ejs');
  });

const myUploader = multer({
  dest: path.join(__dirname, '../public/uploads')
});
router.post('/posts/create',
  myUploader.single('picPath'),

  (req, res, next) => {
    console.log('almost there!');

    const newPost = new Post({
      content: req.body.content,
      creatorId: req.user._id,
      picPath: `/uploads/${req.file.filename}`,
      picName: req.body.picName
    });
    newPost.save((err) => {
      console.log('posted that ish..');

      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    });
  });
router.get('/:id/postpage',
  (req, res, next) => {
    const postId = req.params.id;
    Post.findById(postId,
      (err, found) => {
        if (err) {
          next(err);
          return;
        }

        if (found) {
          User.findById(found.creatorId, (err, theUser) => {
            if (err) {
              next(err);
              return;
            }
            if (theUser) {
              res.render('posts/post-page', {
                post: found,
                users: theUser
              });
            }
          });
        }
      });

  });
const myComments = multer({
  dest: path.join(__dirname, '../public/comments')
});

router.post('/:id/new/comment',
  myComments.single('imagePath'),
  (req, res, next) => {
    const commentid = req.params.id;
    Post.findById(commentid, (err, post) => {
      if (err) {
        next(err);
        return;
      }
      if (post) {
        const newComment = new comment({
          content: req.body.content,
          authorId: req.user._id,
          imagePath: `/comments/${req.file.filename}`,
          imageName: req.body.imageName
        });
        post.comment.push(newComment);
        post.save((err) => {
          if (err) {
            next(err);
            return;
          }
          res.redirect(`/${post._id}/postpage`);
        });
      }
    });
  });

module.exports = router;
