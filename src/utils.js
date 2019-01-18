const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some'; // used to sign the JWTs which you're using for your users

// this is a helper function which I call in resolvers which require authentication (like 'post' and 'vote')
function getUserId(context) {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId,
};
