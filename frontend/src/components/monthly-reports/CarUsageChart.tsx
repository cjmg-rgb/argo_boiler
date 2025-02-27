import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ICarReport } from "@/types";

interface Props {
  currentDate: {
    month: string;
    year: number;
  };
  carReports: ICarReport[];
}

const CarChart = ({ currentDate, carReports }: Props) => {
  const { month, year } = currentDate;

  const chartData = carReports.map((carReport) => ({
    carReport: carReport.id,
    hours: carReport.hoursRenderedPerDept.reduce(
      (hours, dept) => dept.hoursRendered + hours,
      0,
    ),
    fill: carReport.colorTag.label,
  }));
  const chartConfig: any = {} satisfies ChartConfig;

  carReports.forEach((carReport) => {
    chartConfig[carReport.id] = {
      label: `${carReport.model} - ${carReport.plateNumber}`,
      color: carReport.colorTag.label,
    };
  });

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Pie Chart - Hours Consumed Per Car</CardTitle>
        <CardDescription>
          For {""}
          <span>
            {month}, {year}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent labelKey="carReport" />}
            />
            <Pie data={chartData} dataKey="hours" />
            <ChartLegend
              align="right"
              content={<ChartLegendContent nameKey="carReport" />}
              className="-translate-y-2 flex-wrap gap-2 whitespace-nowrap text-black [&>*]:basis-1/4"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="font-medium">Monthly Hour Rendering Summary by Car</div>
        <div className="leading-none text-muted-foreground">
          Displaying the total hours rendered per car this month.
        </div>
      </CardFooter>
    </Card>
  );
};

export default CarChart;
