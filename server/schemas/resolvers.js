const { User } = require('../models');

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // get a user by username or id
    user: async (parent, { identifier }) => {
      return User.findOne({ $or: [{ _id: identifier }, { username: identifier }]})
        .select('-__v -password');
        // .populate('savedBooks');
    },
    
  },

  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { username, password }) => {
      const user = await User.findOne({ $or: [{ username }, { email: username }] });

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

    saveBook: async (parent, args, context) => {
      // console.log(args)
      if (context.user) {
        // const book = await Book.create({ ...args, username: context.user.username });

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id},
          { $addToSet: { savedBooks: args } },
          { new: true }
        )
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    deleteBook: async (parent, { bookId }, context) => {
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