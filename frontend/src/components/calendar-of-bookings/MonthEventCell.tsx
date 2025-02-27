import { EventContentArg } from "@fullcalendar/core";
import { formatNumberToDateWithHoursAndMinutes } from "../../utils/helpers";
import { IBooking } from "@/types";

interface Props extends EventContentArg {}

const MonthEventCell = ({ event }: Props) => {
  const { start, end, extendedProps, backgroundColor } = event;
  const { title, location } = extendedProps as IBooking;

  return (
    <div
      className="flex flex-col overflow-hidden rounded p-2 text-white"
      style={{ backgroundColor: backgroundColor }}
    >
      <span className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-light">
        {formatNumberToDateWithHoursAndMinutes(start!.getTime())} to{" "}
        {formatNumberToDateWithHoursAndMinutes(end!.getTime())}
      </span>
      <span className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">
        {title}
      </span>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-extralight">
        Location: {location}
      </span>
    </div>
  );
};

export default MonthEventCell;
