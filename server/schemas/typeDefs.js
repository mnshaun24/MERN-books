const { gql } = require("apollo-server-express");

const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
}

type Book {
    authors: [String!]!
    description: String
    bookIdent: String!
    image: String
    link: String
    title: String!
}

type Query {
    me: User
}

input BookInput {
    authors: [String!]!
    description: String
    bookIdent: String
    image: String
    link: String
    title: String!
}

type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    deleteBook(bookIdent: String!): User
}`

module.exports = typeDefs;