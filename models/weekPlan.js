const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ingredient = require('./ingredient');

const weekPlanSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  customShoppingList: [Ingredient],

  plan: [{
    day: {
      type: String,
      required: true
    },
    persons: {
      type: Number,
      //required: true
    },
    dish: {
      type: Schema.Types.ObjectId,
      ref: 'Receipt'
    },
  }]
}, { timestamps: true } );

module.exports = weekPlanSchema;

//module.exports = mongoose.model('WeekPlan',weekPlanSchema);
