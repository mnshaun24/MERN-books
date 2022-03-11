const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models")

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select("-__v -password")
                .populate("username")
                .populate("email")
                .populate("savedBooks");

                return userData;
            }

            throw new AuthenticationError("Not logged in");
        }
        },

        Mutation: {
            login: async (parent, {email, password }) => {
                const user = await User.findOne({ email });

                if(!user) {
                    throw new AuthenticationError("Check your login information and try again");
                }

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError("Check your login information and try again");
                }

                const token = signToken(user);
                return { token, user };
            },
            createUser: async (parent, args) => {
                const user = await User.create(args);
                const token = signToken(user);

                return { token, user };
            },
            saveBook: async (parent, args, context) => {
                if (context.user) {
                    const updateUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $addToSet: { savedBooks: args.input }},
                        { new: true }
                    )

                    return updateUser;
                }
            },
            deleteBook: async (parent, args, context) => {
                if (context.user) {
                    const updateUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookIdent: args.bookIdent } } },
                        { new: true }
                    )

                    return updateUser;
                }

                throw new AuthenticationError("Please login and try again.")
            }
        }
    }

module.exports = resolvers;