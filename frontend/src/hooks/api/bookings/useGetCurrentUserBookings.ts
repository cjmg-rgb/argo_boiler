import { IBookings, IResponse, IRequestError } from "@/types";
import { useQuery, UseQueryResult, QueryFunction } from "@tanstack/react-query";
import api from "@/lib/axios";

type TQueryResponse = IResponse<IBookings>;

const getCurrentUserBookings: QueryFunction<IBookings> = async () => {
  const response = await api.get<TQueryResponse>("/api/bookings/my-bookings");
  return response.data.data;
};

const useGetCurrentUserBookings = (): UseQueryResult<
  IBookings,
  IRequestError
> => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: getCurrentUserBookings,
    refetchOnWindowFocus: false,
  });
};

export default useGetCurrentUserBookings;
