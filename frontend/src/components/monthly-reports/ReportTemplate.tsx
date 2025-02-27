import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { forwardRef } from "react";
import { ICarReport, IDepartmentReport } from "@/types";
import moment from "moment";

interface Props {
  currentDate: {
    month: string;
    year: number;
  };
  getLastDayOfTheMonth: number;
  carReports: ICarReport[];
  departmentReports: IDepartmentReport[];
}

const ReportTemplate = forwardRef<HTMLDivElement, Props>(
  (
    { currentDate, getLastDayOfTheMonth, carReports, departmentReports },
    ref,
  ) => {
    const dateAndTimeGenerated = new Date();
    const departments = carReports[0].hoursRenderedPerDept
      .map((dept) => dept.name)
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));

    const sortedDepartmentTotalHours = [...departmentReports]
      .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
      .map((department) => department.totalRenderedHours);

    return (
      <Card ref={ref} className="border-none p-5 shadow-none">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold">
            Argo Navis Summary of Booking
          </h1>
          <h2 className="text-lg">
            Fot the Period of{" "}
            {`${currentDate.month} 1 -
            ${getLastDayOfTheMonth} ${currentDate.year}`}
          </h2>
        </header>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-4 text-center">Cars</TableHead>
                {departments.map((dept) => (
                  <TableHead key={dept} className="text-center">
                    {dept}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {carReports.map((carReport) => (
                <TableRow
                  key={carReport.id}
                  style={{ backgroundColor: carReport.colorTag.label }}
                  className="text-white"
                >
                  <TableCell className="text-center">
                    {carReport.model}
                  </TableCell>
                  {carReport.hoursRenderedPerDept
                    .map((dept) => dept)
                    .sort((a, b) =>
                      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1,
                    )
                    .map((report) => (
                      <TableCell key={report.id} className="text-center">
                        {report.hoursRendered}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="pt-6 text-center font-bold">
                  Total
                </TableCell>
                {sortedDepartmentTotalHours.map((hours) => (
                  <TableCell key={hours} className="pt-6 text-center">
                    {hours}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-5 flex">
            <div className="ml-auto text-right">
              <p className="text-sm font-medium">Date and time generated:</p>
              <p className="text-sm">
                {moment(dateAndTimeGenerated).format("LLLL")}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  },
);

export default ReportTemplate;
