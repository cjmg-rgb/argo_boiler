import {
  MutationFunction,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { IResponse, IDriver, IAddDriverForm, IRequestError } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<IDriver>;

const addDriver: MutationFunction<IDriver, IAddDriverForm> = async ({
  confirmPassword,
  ...rest
}) => {
  const response = await api.post<TMutationResponse>("/api/drivers", rest);

  return response.data.data;
};

const useAddDriver = (): UseMutationResult<
  IDriver,
  IRequestError,
  IAddDriverForm
> => {
  return useMutation({
    mutationKey: ["add-driver"],
    mutationFn: addDriver,
  });
};

export default useAddDriver;
