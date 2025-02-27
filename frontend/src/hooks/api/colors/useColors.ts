import { useQuery, QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { IColors, IRequestError, IResponse } from "@/types";
import api from "@/lib/axios";

type TResponse = IResponse<IColors>;

const getColors: QueryFunction<IColors> = async () => {
  const response = await api.get<TResponse>("/api/colors");
  return response.data.data;
};

const useColors = (): UseQueryResult<IColors, IRequestError> => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    refetchOnWindowFocus: false,
    staleTime: 60_000 * 60 * 6,
  });
};

export default useColors;
