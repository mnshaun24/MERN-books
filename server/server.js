const express = require('express');

// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
// const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: authMiddleware
  });

  await server.start();

  server.applyMiddleware({ app });

  console.log(`Test GraphQL at http://localhost:${port}${server.graphqlPath}`);

};

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});




// const app = express();
// const PORT = process.env.PORT || 3001;


// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

