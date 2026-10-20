import { useMutation } from "@tanstack/react-query";
import { login, signup } from "@/api/auth.ts";
import { useNavigate } from "react-router-dom";
import type { StoredAuth } from "@/types/auth.type.ts";
import { useSession } from "@/hooks/useSession.tsx";

function useAuthSuccess() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  return (auth: StoredAuth) => {
    signIn(auth);
    navigate("/channels", { replace: true });
  };
}
export const useLogin = () =>
  useMutation({ mutationFn: login, onSuccess: useAuthSuccess() });
export const useSignup = () =>
  useMutation({ mutationFn: signup, onSuccess: useAuthSuccess() });
