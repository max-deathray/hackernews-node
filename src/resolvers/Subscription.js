// FYI: resolvers for subscriptions are slightly different thatn the ones for queuries and mutations

// 1. Rather than returning data directly, they return an AsyncIterator which subsequently is used by the GraphQL server to push the event data to the client

// 2. Subscription resolvers are wrapped inside an object and need to be provided as the vaue for a subscribe field

function newLinkSubscribe(parent, args, context) {
  return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node();
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => {
    return payload;
  },
};

module.exports = {
  newLink,
};
