import {
  UseMutationResult,
  MutationFunction,
  useMutation,
} from "@tanstack/react-query";
import { IResponse, IUser, IRequestError, IAddUserForm } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<IUser>;

const addUser: MutationFunction<IUser, IAddUserForm> = async (userData) => {
  const response = await api.post<TMutationResponse>("/api/users", {
    email: userData.email,
    name: userData.name,
    password: userData.password,
    departmentId: userData.department,
    role: userData.role,
  });

  return response.data.data;
};

const useAddUser = (): UseMutationResult<
  IUser,
  IRequestError,
  IAddUserForm
> => {
  return useMutation({ mutationFn: addUser, mutationKey: ["add-user"] });
};

export default useAddUser;
