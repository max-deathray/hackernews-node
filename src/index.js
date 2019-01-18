const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');

// graphql-yoga is a fully-featured GraphQL server based on Express.js (+ more libraries to help build production-ready GraphQL servers)
const { GraphQLServer } = require('graphql-yoga');

// import the prisma client instance so my resolvers have access to it
const { prisma } = require('./generated/prisma-client');

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
};

// instantiate the server & pass the typeDefs & resolvers to it -> the server now knowa which API operations are accepted and how they should be resolved
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers, // how to resolve API operations
  context: request => {
    return {
      ...request, // allows resolvers access to read Authorization header & validate user who submitted req
      prisma, // this gives the resolvers access context.prisma
    };
  },
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
