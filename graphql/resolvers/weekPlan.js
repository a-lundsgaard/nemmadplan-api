const User = require('../../models/user');
const { transformWeekPlan } = require('./merge');


module.exports = {

  weekPlans: async (args, req) => {

    // protecting our resolver by accessing metadata from the request object attached by our middleware
    if(!req.isAuth) {
       throw new Error('Unauthenticated');
     }

    try {
      const user = await User.findById(req.userId);
      const weekPlans = user.createdPlans;

      return weekPlans.map(weekPlan => {
        return transformWeekPlan(weekPlan);
      });
    } catch (err) {
      throw err;
    }
  },

  createWeekPlan: async (args, req) => {

    // protecting our resolver by accessing metadata from the request object attached by our middleware
    /* if(!req.isAuth) {
       throw new Error('Unauthenticated');
     }*/

    console.log('Function called');

    const weekPlan = {
      name: args.weekPlanInput.name,
      customShoppingList: args.weekPlanInput.customShoppingList,
      plan: args.weekPlanInput.plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let createdWeekPlan;
    try {
      createdWeekPlan = transformWeekPlan(weekPlan);
      const creator = await User.findById("5f7a211453451f20206bd7a4");

      if (!creator) {
        throw new Error('User not found.');
       }
      creator.createdPlans.push(weekPlan);
      await creator.save();
      console.log('Weekplan successfully created: ', createdWeekPlan);
      return createdWeekPlan;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },


  deleteWeekPlan: async (args, req) => {

    // protecting our resolver by accessing metadata from the request object attached by our middleware
    if(!req.isAuth) {
       throw new Error('Unauthenticated');
     }
    console.log('Function delete plan was called');

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error('User not found.');
      }
      const unwantedPlan = user.createdPlans.id(args.weekPlanId);
      if (!unwantedPlan) {
        throw new Error('Plan not found');
      }
      console.log(unwantedPlan);

      unwantedPlan.remove();
      await user.save();

      console.log('Weekplan successfully deleted');
      // console.log(createdWeekPlan)
      return unwantedPlan;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

};