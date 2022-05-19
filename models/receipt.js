const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ingredient = require('./ingredient');

const receiptSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
  },
  persons: {
    type: Number,
    required: true
  },

  source: {
    type: String,
  },

  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },

  favorite: {
    type: Boolean
  },

  ingredients: [Ingredient],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true } );

module.exports = mongoose.model('Receipt', receiptSchema);