import { useQuery, QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { IDepartments, IResponse, IRequestError } from "@/types";
import api from "@/lib/axios";

type TQueryResponse = IResponse<IDepartments>;

const getDepartments: QueryFunction<IDepartments> = async () => {
  const response = await api.get<TQueryResponse>("api/departments");
  return response.data.data;
};

const useDepartments = (): UseQueryResult<IDepartments, IRequestError> => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    refetchOnWindowFocus: false,
    staleTime: 60_000 * 60 * 24,
  });
};

export default useDepartments;
