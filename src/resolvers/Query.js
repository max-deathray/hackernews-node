function feed(root, args, context) {
  return context.prisma.links();
}

module.exports = {
  feed,
};
