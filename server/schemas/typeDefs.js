// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  savedBooks: [Book]
}

type Book {
  _id: ID
  authors: [String]
  description: String
  bookId: String
  image: String
  link: String
  title: String
}

type Auth {
  token: ID!
  user: User
}

input bookInput {
  authors: [String]!
  description: String
  bookId: String!
  image: String
  link: String
  title: String!
}

type Query {
  user(identifier: String!): User
}

type Mutation {
  login(username: String!, password: String!): Auth
  createUser(username: String!, email: String!, password: String!): Auth
  saveBook(authors: [String]!, bookId: String!, title: String!): User
  deleteBook(bookId: String!): User
}

`;

// export the typeDefs
module.exports = typeDefs;




// const { Schema } = require('mongoose');

// // This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
// const bookSchema = new Schema({
//   authors: [
//     {
//       type: String,
//     },
//   ],
//   description: {
//     type: String,
//     required: true,
//   },
//   // saved book id from GoogleBooks
//   bookId: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//   },
//   link: {
//     type: String,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = bookSchema;
