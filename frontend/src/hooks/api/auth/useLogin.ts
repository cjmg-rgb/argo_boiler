import {
  useMutation,
  MutationFunction,
  UseMutationResult,
} from "@tanstack/react-query";
import api from "../../../lib/axios";
import { IRequestError, ILoginData, IResponse, IUser } from "@/types";

type TResponse = IResponse<IUser>;

const login: MutationFunction<IUser, ILoginData> = async (loginData) => {
  const response = await api.post<TResponse>("/api/auth/login", loginData);
  return response.data.data;
};

const useLogin = (): UseMutationResult<IUser, IRequestError, ILoginData> => {
  return useMutation({
    mutationFn: login,
  });
};

export default useLogin;
