const signUpApi = async (formData) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to Sign Up");
  return data;
};

const loginApi = async (formData) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to login");
  return data;
};

const fetchPostsApi = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
  return data;
};

const fetchNotificationApi = async () => {
  const res = await fetch("/api/notifications");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch notifications");
  return data;
};

const deleteNotificationsApi = async () => {
  const res = await fetch("/api/notifications", {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete notifications");
  return data;
};

const createPostApi = async ({ text, img }) => {
  const res = await fetch("/api/posts/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, img }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create post");
  return data;
};

const rePostApi = async (postId) => {
  const res = await fetch(`/api/posts/rePost/${postId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falied to Repost");
  return data;
};

const updateProfileApi = async (formData) => {
  const res = await fetch("/api/users/update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to update profile");
  return result;
};

const fetchUserProfileApi = async (currentUserId) => {
  const res = await fetch(`/api/users/profile/${currentUserId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch user");
  return data;
};

const fetchSuggestedUsers = async () => {
  const res = await fetch("/api/users/suggested");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch suggested users");
  return data;
};

const likePostApi = async (postId) => {
  const res = await fetch(`/api/posts/like/${postId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to like the post");
  return data;
};

const commentingPostApi = async (postId, comment) => {
  const res = await fetch(`/api/posts/comment/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: comment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete the post");
  return data;
};

const deletePostApi = async (postId) => {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete the post");
  return data;
};

const logoutApi = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  const authUser = await res.json();
  if (!res.ok) throw new Error(authUser.error || "Failed to logout");
  return authUser;
};

export {
  signUpApi,
  loginApi,
  fetchPostsApi,
  rePostApi,
  updateProfileApi,
  fetchUserProfileApi,
  fetchNotificationApi,
  deleteNotificationsApi,
  createPostApi,
  likePostApi,
  commentingPostApi,
  deletePostApi,
  fetchSuggestedUsers,
  logoutApi,
};
