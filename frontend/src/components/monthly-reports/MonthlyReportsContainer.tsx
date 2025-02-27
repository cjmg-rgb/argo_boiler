import { useState } from "react";
import ChartContainer from "./ChartContainer";
import { Button } from "@/components/ui/button";
import { VscArrowSmallLeft, VscArrowSmallRight } from "react-icons/vsc";
import ReportContainer from "./ReportContainer";
import useGetReports from "@/hooks/api/bookings/useGetReports";

const monthList = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthlyReportsContainer = () => {
  const [date, setDate] = useState(new Date());
  const [generate, setGenerate] = useState<boolean>(false);
  const { data, isLoading, isSuccess, isError } = useGetReports(
    date.getMonth() + 1,
    date.getFullYear(),
  );

  const handleNext = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);

      return newDate;
    });
  };

  const handlePrevious = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      console.log(newDate);
      newDate.setMonth(prev.getMonth() - 1);

      return newDate;
    });
  };

  const getLastDateOfTheMonth = (date: Date) => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    currentDate.setDate(currentDate.getDate() - 1);

    return currentDate.getDate();
  };

  return (
    <div>
      <div className="mb-5 flex flex-col items-center justify-center gap-x-3">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-x-4">
            <div>
              <Button variant="ghost" onClick={handlePrevious}>
                <VscArrowSmallLeft size={25} />
              </Button>
            </div>
            <div className="flex w-[300px] justify-center">
              <span className="whitespace-nowrap text-[25px] font-bold uppercase">
                {monthList[date.getMonth()]} 1-{getLastDateOfTheMonth(date)},{" "}
                {date.getFullYear()}
              </span>
            </div>
            <div>
              <Button variant="ghost" onClick={handleNext}>
                <VscArrowSmallRight size={25} />
              </Button>
            </div>
          </div>
          <div>
            <span className="text-[13px] text-muted-foreground">
              View Reports Per Month
            </span>
          </div>
        </div>
      </div>
      <ChartContainer
        currentDate={{
          month: monthList[date.getMonth()],
          year: date.getFullYear(),
        }}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        reports={data}
      />
      <div className="mt-5">
        <Button
          disabled={isLoading || isError}
          onClick={() => {
            if (isSuccess) {
              setGenerate(true);
            }
          }}
        >
          Generate Report
        </Button>
      </div>
      {generate && (
        <ReportContainer
          carReports={data!.carReports}
          departmentReports={data!.departmentReports}
          getLastDayOfTheMonth={getLastDateOfTheMonth(date)}
          closeModal={() => setGenerate(false)}
          currentDate={{
            month: monthList[date.getMonth()],
            year: date.getFullYear(),
          }}
        />
      )}
    </div>
  );
};

export default MonthlyReportsContainer;
