const Event = require('../../models/event');
const User = require('../../models/user');
const Receipt = require('../../models/receipt');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};


const user = async userId => {
  try {
    const user = await User.findById(userId);

    console.log('Looking for week plans')
    console.log(`Found ${user._doc.createdPlans.length} plans`)
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
      createdPlans: user._doc.createdPlans.map(plan => transformWeekPlan(plan))
    };
  } catch (err) {
    throw err;
  }
};

const transformWeekPlan = weekPlan => {
  console.log('**********      Calling from transformWeekplan       ***********');
  // if the weekPlan was retrieved from database = ._doc, if it was created from a class and not retreived = weekPlan
  weekPlan = weekPlan._doc || weekPlan;
  return {
    ...weekPlan,
    plan: receipts.bind(this, weekPlan.plan),
    createdAt: dateToString(weekPlan.createdAt),
    updatedAt: dateToString(weekPlan.createdAt)
  };
};


const receipts = async dayPlans => {
  console.log('New dayplan found:')
  // console.log({...dayPlans})

  const ids = dayPlans.map(el => el.dish) // makes array with id's
  try {
    const uniqueReceipts = await Receipt.find({ _id: { $in: ids } }) // metoden returnerer ikke duplicates    
    // Laver object med _id som keys og dish som value til at lave lookup med
    const findDishById = uniqueReceipts.reduce((docs, doc) => ({ ...docs, [doc._id]: doc }), {});

    const dayPlansToReturn = [];
    dayPlans.forEach(dayPlan => {
      const recipe = findDishById[dayPlan.dish]
      if (!recipe) return;
      dayPlansToReturn.push({
        day: dayPlan.day,
        persons: dayPlan.persons,
        //...dayPlan,
        dish: transformReceipt(recipe)
      });
    });
    return dayPlansToReturn;
    
  } catch (err) {
    console.error(err)
  }
};

const transformReceipt = receipt => {
  return {
    ...receipt._doc,
    _id: receipt.id,
    creator: user.bind(this, receipt.creator),
    createdAt: dateToString(receipt._doc.createdAt),
    updatedAt: dateToString(receipt._doc.updatedAt)
  };
};




const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};


exports.transformWeekPlan = transformWeekPlan;
exports.transformReceipt = transformReceipt;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;


// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;