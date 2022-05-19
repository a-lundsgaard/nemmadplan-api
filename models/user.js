const mongoose = require('mongoose');
const weekPlan = require('./weekPlan');
const Schema = mongoose.Schema;


const userSchema = new Schema({

  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  createdPlans: [weekPlan],

  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event' // these two models are related, lets mongoose automatically merge data
    }
  ]
});

module.exports = mongoose.model('User', userSchema);