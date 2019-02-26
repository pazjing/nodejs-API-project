//app.js
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const movies = require('./routes/movies');

app.use('/api/genres', genres);
app.use('/api/movies', movies);

module.exports = app;