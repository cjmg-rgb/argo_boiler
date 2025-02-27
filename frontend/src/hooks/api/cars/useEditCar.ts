import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import { IResponse, ICar, IRequestError, IEditCarFields } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<ICar>;

const editCar: MutationFunction<ICar, IEditCarFields> = async ({
  id,
  ...rest
}) => {
  const response = await api.patch<TMutationResponse>(`/api/cars/${id}`, rest);
  return response.data.data;
};

const useEditCar = (): UseMutationResult<
  ICar,
  IRequestError,
  IEditCarFields
> => {
  return useMutation({ mutationFn: editCar });
};

export default useEditCar;
