import { QueryFunction, useQuery, UseQueryResult } from "@tanstack/react-query";
import { IBookings, IResponse, IRequestError } from "@/types";
import api from "@/lib/axios";

type TResponse = IResponse<IBookings>;

const getBookings: QueryFunction<IBookings> = async () => {
  const response = await api.get<TResponse>("/api/bookings");
  return response.data.data;
};

const useGetBookings = (): UseQueryResult<IBookings, IRequestError> => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
};

export default useGetBookings;
