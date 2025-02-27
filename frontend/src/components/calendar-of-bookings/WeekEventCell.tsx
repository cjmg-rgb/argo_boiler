import { EventContentArg } from "@fullcalendar/core";
import { formatNumberToDateWithHoursAndMinutes } from "../../utils/helpers";
import style from "./calendar.module.scss";
import { IBooking } from "@/types";

interface Props extends EventContentArg {}

const WeekEventCell = ({ event }: Props) => {
  const { extendedProps, backgroundColor, start, end } = event;
  const {} = extendedProps as IBooking;

  return (
    <div
      className="relative overflow-hidden text-ellipsis whitespace-nowrap p-2"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="bottom-0 flex flex-col overflow-hidden text-ellipsis whitespace-nowrap rounded p-2 text-red-400">
        <span className={`${style.cell_date} ${style.week_cell_date}`}>
          {formatNumberToDateWithHoursAndMinutes(start!.getTime())} to{" "}
          {formatNumberToDateWithHoursAndMinutes(end!.getTime())}
        </span>
      </div>
    </div>
  );
};

export default WeekEventCell;
