import {
  IPaginatedUsers,
  IRequestError,
  IResponse,
  IUsersQueryFilter,
} from "@/types";
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
  QueryFunction,
} from "@tanstack/react-query";
import api from "@/lib/axios";

type TResponse = IResponse<IPaginatedUsers>;

const getUsers: QueryFunction<
  IPaginatedUsers,
  [string, IUsersQueryFilter],
  number
> = async ({ queryKey, pageParam }) => {
  const { keyword, departmentId } = queryKey[1] as IUsersQueryFilter;
  const response = await api.get<TResponse>(
    `/api/users?keyword=${keyword}&department=${departmentId}&page=${pageParam}&limit=10`,
  );

  return response.data.data;
};

const useGetUsers = (
  queryFilter: IUsersQueryFilter,
): UseInfiniteQueryResult<InfiniteData<IPaginatedUsers>, IRequestError> => {
  return useInfiniteQuery({
    queryKey: ["users", queryFilter],
    queryFn: getUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
    staleTime: 60_000 * 60 * 4,
  });
};

export default useGetUsers;
