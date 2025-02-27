import { IDriver, IEditDriverFields, IRequestError, IResponse } from "@/types";
import api from "@/lib/axios";
import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";

type TMutationResponse = IResponse<IDriver>;

const editDriverDetails: MutationFunction<IDriver, IEditDriverFields> = async ({
  id,
  ...rest
}) => {
  const response = await api.patch<TMutationResponse>(
    `/api/drivers/${id}`,
    rest,
  );
  return response.data.data;
};

const useEditDriverDetails = (): UseMutationResult<
  IDriver,
  IRequestError,
  IEditDriverFields
> => {
  return useMutation({
    mutationKey: ["edit-driver"],
    mutationFn: editDriverDetails,
  });
};

export default useEditDriverDetails;
