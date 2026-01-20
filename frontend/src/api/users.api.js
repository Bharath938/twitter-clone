import { http } from "./http";

export const searchUsers = async ({ q, cursor, limit = 10 }) => {
  const res = await http.get("/users/search", {
    params: {
      q,
      cursor,
      limit,
    },
  });
  return res.data;
};
