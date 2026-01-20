import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotificationApi,
  fetchPostsApi,
  fetchSuggestedUsers,
  fetchUserProfileApi,
} from "../../api/posts.api";

const usePosts = ({ url, feedType, userId }) => {
  const {
    data: posts,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType, userId],
    queryFn: () => fetchPostsApi(url),
  });

  return { posts, isLoading, isRefetching };
};

const useNotifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotificationApi(),
  });
  return { notifications, isLoading };
};
const useUserProfile = (currentUserId) => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile", currentUserId],
    queryFn: () => fetchUserProfileApi(currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return { user, isLoading, isRefetching };
};

const useSuggestedUsers = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () => fetchSuggestedUsers(),
  });
  return { suggestedUsers, isLoading };
};

export { usePosts, useNotifications, useUserProfile, useSuggestedUsers };
