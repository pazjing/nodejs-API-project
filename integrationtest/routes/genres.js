const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});


module.exports = router;