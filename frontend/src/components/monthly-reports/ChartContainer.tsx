import { IReports } from "@/types";
import CarChart from "./CarUsageChart";
import HoursUsageChart from "./HoursUsageChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";

interface Props {
  currentDate: { month: string; year: number };
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reports: IReports | undefined;
}

const ChartContainer = ({
  currentDate,
  isLoading,
  isSuccess,
  isError,
  reports,
}: Props) => {
  return (
    <div className="flex h-[580px] gap-3">
      {isLoading && (
        <Fragment>
          <Skeleton className="h-full flex-1" />
          <Skeleton className="h-full flex-1" />
        </Fragment>
      )}
      {isError && <div className="text-red-500">Error loading reports...</div>}
      {isSuccess && (
        <Fragment>
          <div className="h-full flex-1">
            <CarChart
              currentDate={currentDate}
              carReports={reports!.carReports}
            />
          </div>
          <div className="flex-1">
            <HoursUsageChart
              currentDate={currentDate}
              departmentReports={reports!.departmentReports}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ChartContainer;
