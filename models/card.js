const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  owner: {
    required: true,
    type: { ObjectId },
    ref: 'user',
  },
  likes: {
    type: { ObjectId },
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
