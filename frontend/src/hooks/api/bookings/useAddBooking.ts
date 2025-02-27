import {
  useMutation,
  MutationFunction,
  UseMutationResult,
} from "@tanstack/react-query";
import { IResponse, IBooking, IRequestError, IAddBookingForm } from "@/types";
import api from "@/lib/axios";
import { formatDateObjectToString } from "@/utils/helpers";

type TQueryResponse = IResponse<IBooking>;

const addBooking: MutationFunction<IBooking, IAddBookingForm> = async ({
  date,
  ...rest
}) => {
  const response = await api.post<TQueryResponse>("/api/bookings", {
    date: formatDateObjectToString({
      year: date!.getFullYear(),
      month: date!.getMonth() + 1,
      date: date!.getDate(),
    }),
    ...rest,
  });
  return response.data.data;
};

const useAddBooking = (): UseMutationResult<
  IBooking,
  IRequestError,
  IAddBookingForm
> => {
  return useMutation({ mutationFn: addBooking, mutationKey: ["add-booking"] });
};

export default useAddBooking;
