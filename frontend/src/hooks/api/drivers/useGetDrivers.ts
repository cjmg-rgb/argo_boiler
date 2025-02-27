import { QueryFunction, useQuery, UseQueryResult } from "@tanstack/react-query";
import { IDrivers, IRequestError, IResponse } from "@/types";
import api from "@/lib/axios";

type TQueryResponse = IResponse<IDrivers>;

const getDrivers: QueryFunction<IDrivers> = async () => {
  const response = await api.get<TQueryResponse>("/api/drivers");
  return response.data.data;
};

const useGetDrivers = (): UseQueryResult<IDrivers, IRequestError> => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
    refetchOnWindowFocus: false,
    staleTime: 60_000 * 60 * 6,
  });
};

export default useGetDrivers;
