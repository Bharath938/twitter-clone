import React from "react";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const {
    data: authUser,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");

      if (res.status === 401 || res.status === 403) return null;

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to fetch auth user");
      return data;
    },
    retry: false,
  });

  return { authUser, isError, error, isLoading };
};
