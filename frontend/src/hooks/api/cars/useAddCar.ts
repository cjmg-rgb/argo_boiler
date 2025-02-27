import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import { IResponse, ICar, IRequestError, IAddCarFields } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<ICar>;

const addCar: MutationFunction<ICar, IAddCarFields> = async (carData) => {
  const response = await api.post<TMutationResponse>("/api/cars", carData);
  return response.data.data;
};

const useAddCar = (): UseMutationResult<ICar, IRequestError, IAddCarFields> => {
  return useMutation({ mutationFn: addCar });
};

export default useAddCar;
