const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

function post(parent, args, context) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}

async function signup(parent, args, context) {
  // step one: encrypy user's password using bcrypt library
  const password = await bcrypt.hash(args.password, 10);

  // step two: use prisma client to store user in the db
  const user = await context.prisma.createUser({ ...args, password });

  // step three: generate a JWT (signed in as APP_SECRET)
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // step four: return token & user (obj adheres to shape of AuthPayload defined in GraphQL schema)
  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  // step one: use Prisma client to retrieve existing user record by email address
  const user = await context.prisma.user({ email: args.email });
  // if no user exists in db, return error
  if (!user) {
    throw new Error('No such user found');
  }

  // step two: compare provided pw with the pw in db
  const valid = await bcrypt.compare(args.password, user.password);
  // if no match, return error
  if (!valid) {
    throw new Error('Invalid password');
  }

  // step three: generate a JWT (signed in as APP_SECRET)
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // step four: return token & user (obj adheres to shape of AuthPayload defined in GraphQL schema)
  return {
    token,
    user,
  };
}

async function vote(parent, args, context) {
  // step one: validate incoming JWT with getUserId (helper func)
  const userId = getUserId(context);

  //step two:
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  });
}

module.exports = {
  post,
  signup,
  login,
  vote,
};
