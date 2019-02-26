const Joi = require('joi');
const mongoose = require('mongoose');

// schema
genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255
    }
  });
  
//class = model
const Genre = mongoose.model('genre', genreSchema);


function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(3).required()
    };
  
    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;