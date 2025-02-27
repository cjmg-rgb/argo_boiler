import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import {
  IResponse,
  IUser,
  IRequestError,
  IEditUserFieldsWithId,
} from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<IUser>;

const editUser: MutationFunction<IUser, IEditUserFieldsWithId> = async (
  formData,
) => {
  const response = await api.patch<TMutationResponse>(
    `/api/users/${formData.id}`,

    {
      name: formData.name,
      role: formData.role,
      departmentId: formData.departmentId,
      credits: formData.credits,
    },
  );
  return response.data.data;
};

const useEditUser = (): UseMutationResult<
  IUser,
  IRequestError,
  IEditUserFieldsWithId
> => {
  return useMutation({ mutationFn: editUser });
};

export default useEditUser;
