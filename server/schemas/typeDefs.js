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
  authors: [String]
  description: String
  bookId: String!
  image: String
  link: String
  title: String
}

type Query {
  me: User
  user(identifier: String!): User
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook(book: bookInput!): User
  removeBook(bookId: String!): User
}

`;

// export the typeDefs
module.exports = typeDefs;