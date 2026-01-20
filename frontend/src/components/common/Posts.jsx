import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/queries/post.queries";

const Posts = ({ feedType }) => {
  const { id: currentUserId } = useParams();
  const { authUser } = useAuth();

  const getPostsEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${currentUserId}`;
      case "likes":
        return `/api/posts/likedPosts/${currentUserId}`;
      case "rePosts":
        return `/api/posts/rePosts/${currentUserId}`;
      default:
        return "/api/posts/all";
    }
  };

  const url = getPostsEndPoint();

  const { posts, isLoading, isRefetching } = usePosts({
    url,
    feedType,
    userId: currentUserId ? currentUserId : authUser._id,
  });

  return (
    <>
      {isLoading ||
        (isRefetching && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ))}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
