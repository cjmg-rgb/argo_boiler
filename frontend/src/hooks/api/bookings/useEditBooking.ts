import {
  useMutation,
  MutationFunction,
  UseMutationResult,
} from "@tanstack/react-query";
import { IBooking, IEditBookingForm, IResponse, IRequestError } from "@/types";
import { formatDateObjectToString } from "@/utils/helpers";
import api from "@/lib/axios";

type TMutationResponse = IResponse<IBooking>;

export const editBooking: MutationFunction<
  IBooking,
  IEditBookingForm
> = async ({ id, date, ...rest }) => {
  const response = await api.patch<TMutationResponse>(`/api/bookings/${id}`, {
    date: formatDateObjectToString({
      year: date!.getFullYear(),
      month: date!.getMonth() + 1,
      date: date!.getDate(),
    }),
    ...rest,
  });

  return response.data.data;
};

const useEditBooking = (): UseMutationResult<
  IBooking,
  IRequestError,
  IEditBookingForm
> => {
  return useMutation({ mutationFn: editBooking });
};

export default useEditBooking;
