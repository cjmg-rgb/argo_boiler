import { useQuery, QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { IResponse, IRequestError, ICars } from "@/types";
import api from "@/lib/axios";

type TResponse = IResponse<ICars>;

const getCars: QueryFunction<ICars> = async () => {
  const response = await api.get<TResponse>("/api/cars");
  return response.data.data;
};

const useCars = (): UseQueryResult<ICars, IRequestError> => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: getCars,
    refetchOnWindowFocus: false,
    staleTime: 60_000 * 60 * 6,
  });
};

export default useCars;
