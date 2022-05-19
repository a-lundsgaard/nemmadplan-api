const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const receiptResolver = require('./receipt');
const weekPlanResolver = require('./weekPlan')

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...receiptResolver,
  ...weekPlanResolver
};

module.exports = rootResolver;