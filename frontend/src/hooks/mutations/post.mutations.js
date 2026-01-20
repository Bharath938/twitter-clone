import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  commentingPostApi,
  createPostApi,
  deleteNotificationsApi,
  deletePostApi,
  likePostApi,
  loginApi,
  logoutApi,
  rePostApi,
  signUpApi,
  updateProfileApi,
} from "../../api/posts.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignUp = (formData) => {
  const navigate = useNavigate();
  const {
    mutate: signUp,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => signUpApi(formData),
    onSuccess: () => navigate("/login"),
  });
  return { signUp, isError, error, isPending };
};

const useLogin = (formData) => {
  const queryClient = useQueryClient();
  const {
    mutate: login,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => loginApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return { login, isError, error, isPending };
};

const useDeleteNotifications = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteAllNotifications, isPending } = useMutation({
    mutationFn: () => deleteNotificationsApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  return { deleteAllNotifications, isPending };
};

const useUpdateProfile = ({ formData, authUser }) => {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending: isUploading } = useMutation({
    mutationFn: () => updateProfileApi(formData),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["userProfile", authUser.username],
        }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
      toast.success("Profile updated successfully");
    },
  });
  return { updateProfile, isUploading };
};

const useCreatePost = ({ text, img, setText, setImg, imgRef }) => {
  const queryClient = useQueryClient();
  const {
    mutate: createPost,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => createPostApi({ text, img }),
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setText("");
      setImg(null);
      imgRef.current.value = null;
    },
  });
  return { createPost, isError, error, isPending };
};

const useRepost = (postId) => {
  const queryClient = useQueryClient();
  const { mutate: rePost, isPending: isReposting } = useMutation({
    mutationFn: () => rePostApi(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return { rePost, isReposting };
};

const useLikePost = (postId) => {
  const queryClient = useQueryClient();
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: () => likePostApi(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return { likePost, isLiking };
};

const useCommentPost = ({ postId, comment }) => {
  const queryClient = useQueryClient();

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: () => commentingPostApi(postId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return { commentPost, isCommenting };
};

const useDeletePost = (postId) => {
  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePostApi(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return { deletePost, isDeleting };
};

const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  return { logout, isPending };
};

export {
  useSignUp,
  useLogin,
  useUpdateProfile,
  useDeleteNotifications,
  useCreatePost,
  useRepost,
  useLikePost,
  useCommentPost,
  useDeletePost,
  useLogout,
};
