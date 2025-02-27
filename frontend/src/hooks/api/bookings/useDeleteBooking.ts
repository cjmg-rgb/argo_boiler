import {
  useMutation,
  UseMutationResult,
  MutationFunction,
} from "@tanstack/react-query";
import { IRequestError, IResponse } from "@/types";
import api from "@/lib/axios";

type TMutationResponse = IResponse<{ id: string }>;

const deleteBooking: MutationFunction<{ id: string }, string> = async (
  bookingId: string,
) => {
  const response = await api.delete<TMutationResponse>(
    `/api/bookings/${bookingId}`,
  );
  return response.data.data;
};

const useDeleteBooking = (): UseMutationResult<
  { id: string },
  IRequestError,
  string
> => {
  return useMutation({
    mutationKey: ["delete-booking"],
    mutationFn: deleteBooking,
  });
};

export default useDeleteBooking;
