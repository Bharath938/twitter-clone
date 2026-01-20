import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "../../api/users.api";

export const useUserSearch = (searchText) => {
  return useInfiniteQuery({
    queryKey: ["users", "search", searchText],
    enabled: !!searchText,
    queryFn: ({ pageParam = null }) =>
      searchUsers({
        q: searchText,
        cursor: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
};
