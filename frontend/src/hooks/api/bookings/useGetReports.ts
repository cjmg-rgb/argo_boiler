import { useQuery, QueryFunction, UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/axios";
import { IResponse, IReports, IRequestError } from "@/types";

type TQueryResponse = IResponse<IReports>;

const getReports: QueryFunction<IReports, [string, number, number]> = async ({
  queryKey,
}) => {
  const [_, month, year] = queryKey;
  const response = await api.get<TQueryResponse>(
    `/api/bookings/reports?month=${month}&year=${year}`,
  );
  return response.data.data;
};

const useGetReports = (
  month: number,
  year: number,
): UseQueryResult<IReports, IRequestError> => {
  return useQuery({ queryKey: ["reports", month, year], queryFn: getReports });
};

export default useGetReports;
