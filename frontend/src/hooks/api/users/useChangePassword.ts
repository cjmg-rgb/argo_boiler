import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import { IResponse, IRequestError } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<{ success: boolean }>;

const changePassword: MutationFunction<{ success: boolean }, string> = async (
  password,
) => {
  const response = await api.patch<TMutationResponse>(
    "/api/users/change-password",
    { password },
  );

  return response.data.data;
};

const useChangePassword = (): UseMutationResult<
  { success: boolean },
  IRequestError,
  string
> => {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: changePassword,
  });
};

export default useChangePassword;
