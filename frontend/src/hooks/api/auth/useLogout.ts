import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import { IResponse, IRequestError } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<{ success: boolean }>;

const logout: MutationFunction<{ success: boolean }, null> = async () => {
  const response = await api.post<TMutationResponse>("/api/auth/logout");
  return response.data.data;
};

const useLogout = (): UseMutationResult<
  { success: boolean },
  IRequestError,
  null
> => {
  ``;
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
  });
};

export default useLogout;
