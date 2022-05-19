const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ingredient = new Schema({
  name: {
    type: String,
    required: true
  },
  unit: {
    type: String,
  },
  quantity: {
    type: Number,
  }
});

module.exports = Ingredient;