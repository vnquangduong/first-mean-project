const express = require("express");
const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'images/png': 'png',
  'images/jpeg': 'jpeg',
  'images/jpg': 'jpg'
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null
    }

    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extension )
  }
})

router.post('', multer(storageConfig).single('image'), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    console.log(createdPost)
    const newId = createdPost._id.toString()
    console.log(newId)
    res.status(201).json({
      message: 'Post created sucessfully!',
      postID: newId
    })
  })
})

router.get('', (req, res, next) => {
  Post.find()
    .then(document => {
      res.status(200).json({
        message: 'Posts fetched sucessfully',
        posts: document
      });
    });
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({message: 'Post not found!'})
      }
    })
})

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Post updated!" });
    })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ message: 'Post deleted!' });
    })
})

module.exports = router;
