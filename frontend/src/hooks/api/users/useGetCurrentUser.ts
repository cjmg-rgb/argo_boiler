import { IRequestError, IResponse, IUser } from "@/types";
import { useQuery, UseQueryResult, QueryFunction } from "@tanstack/react-query";
import api from "@/lib/axios";

type TQueryResponse = IResponse<IUser>;

const getCurrentUser: QueryFunction<IUser> = async () => {
  const response = await api.get<TQueryResponse>("/api/users/me");
  return response.data.data;
};

const useGetCurrentUser = (): UseQueryResult<IUser, IRequestError> => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetCurrentUser;
