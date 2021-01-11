const { User } = require('../models');

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    // get a user by username or id
    user: async (parent, { identifier }) => {
      return User.findOne({ $or: [{ _id: identifier }, { username: identifier }]})
        .select('-__v -password');
        // .populate('savedBooks');
    },
    
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ $or: [{ username: email }, { email }] });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { book }, context) => {
      // console.log(args)
      if (context.user) {
        // const book = await Book.create({ ...args, username: context.user.username });

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id},
          { $addToSet: { savedBooks: book } },
          { new: true }
        )
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id},
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        )

        if (!updatedUser) {
          return res.status(404).json({ message: "Couldn't find user with this id!" });
        }
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;