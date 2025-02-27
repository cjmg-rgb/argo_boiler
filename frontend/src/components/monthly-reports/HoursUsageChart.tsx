import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IDepartmentReport } from "@/types";

const chartConfig = {
  hours: {
    label: "Hours",
    color: "#608BC1",
  },
} satisfies ChartConfig;

interface Props {
  currentDate: { month: string; year: number };
  departmentReports: IDepartmentReport[];
}

const HoursUsageChart = ({ currentDate, departmentReports }: Props) => {
  const { month, year } = currentDate;
  const mappedDepartmentReports = departmentReports.map((department) => ({
    label: department.name,
    hours: department.totalRenderedHours,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Bar Chart - Consumed Hours Per Department</CardTitle>
        <CardDescription>
          For{" "}
          <span>
            {" "}
            {month}, {year}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={mappedDepartmentReports}
            margin={{
              top: 5,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="label"
              tickLine={true}
              tickMargin={5}
              tickFormatter={(value) => value.slice(0, 3).toUpperCase()}
            />
            <ChartTooltip content={<ChartTooltipContent label="Hours" />} />
            <Bar dataKey="hours" fill="#608BC1" radius={5}>
              <LabelList
                position="top"
                offset={5}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none"></div>
        <div className="leading-none text-muted-foreground">
          Displaying the total hours rendered per department this month.
        </div>
      </CardFooter>
    </Card>
  );
};

export default HoursUsageChart;
