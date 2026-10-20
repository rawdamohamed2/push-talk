import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import type { StoredAuth } from "@/types/auth.type.ts";
import { authStorage } from "@/lib/authStorage.ts";

function useAuthSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (auth: StoredAuth) => {
    queryClient.clear();
    authStorage.set(auth);
    navigate("/channels", { replace: true });
  };
}
export const useLogin = () =>
  useMutation({ mutationFn: login, onSuccess: useAuthSuccess() });
export const useSignup = () =>
  useMutation({ mutationFn: signup, onSuccess: useAuthSuccess() });
