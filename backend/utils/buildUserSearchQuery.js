export const buildUserSearchQuery = (q, cursor) => {
  const query = {};

  if (q) {
    query.$text = { $search: q };
  }

  if (cursor) {
    query._id = { $lt: cursor };
  }

  return query;
};
