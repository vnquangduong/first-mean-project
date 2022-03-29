const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts')

const app = express();

mongoose.connect("mongodb+srv://admin:26iYtKQoL1Czmae6@cluster0.ek80p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Resquested-With, Content-Type, Accept"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

app.use('/api/posts', postsRoutes);

module.exports = app;
