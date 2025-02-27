import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import { IRequestError, IResponse } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<{ id: string }>;

const deleteDriver: MutationFunction<
  { id: string },
  { driverId: string }
> = async ({ driverId }) => {
  const response = await api.delete<TMutationResponse>(
    `/api/drivers/${driverId}`,
  );
  return response.data.data;
};

const useDeleteDriver = (): UseMutationResult<
  { id: string },
  IRequestError,
  { driverId: string }
> => {
  return useMutation({
    mutationKey: ["delete-driver"],
    mutationFn: deleteDriver,
  });
};

export default useDeleteDriver;
