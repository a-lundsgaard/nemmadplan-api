const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {

  verifyUser: async (args, req) => {

    if(!req.isAuth) {
       throw new Error('Unauthenticated: ' + args.token);
     }

    try {
      const user = await User.findById(req.userId);
      console.log(user.email)

      const user1 = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: null
      });

      return user1
      
    } catch (error) {
      throw error
    }
  },

  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({email: email});
    if (!user) {
      throw new Error('User does not exist');
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual) {
      throw new Error('Password is incorrect')
    }
    const token = jwt.sign({userId: user.id, email: user.email }, process.env.JWT_KEY, {
      expiresIn: '1h'
    })
    return { userId: user.id, token: token, tokenExpiration: 1 }
  }


};