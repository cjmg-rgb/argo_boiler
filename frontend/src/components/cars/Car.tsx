import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICar } from "@/types";
import { FaCar } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";
import { numberToDay } from "@/utils/helpers";
import EditCarDialog from "./EditCarDialog";

interface Props extends ICar {}

const Car = ({
  id,
  model,
  codingDay,
  plateNumber,
  driver,
  colorTag,
}: Props) => {
  return (
    <Card className="flex w-[350px] flex-col overflow-hidden rounded-sm border">
      <CardHeader>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-row gap-x-4">
            <div
              className="flex size-[60px] items-center justify-center rounded-full text-white"
              style={{ backgroundColor: colorTag.label }}
            >
              <FaCar size={28} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{model}</CardTitle>
              <CardDescription>{plateNumber}</CardDescription>
            </div>
          </div>
          <div className="mb-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SlOptionsVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <EditCarDialog
                  id={id}
                  model={model}
                  codingDay={codingDay}
                  plateNumber={plateNumber}
                  driver={driver}
                  colorTag={colorTag}
                />
                {/*  <DropdownMenuItem className="text-red-600 hover:bg-red-100">
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Coding day</span>
            <span>{numberToDay(codingDay)}</span>
          </div>
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Driver</span>
            <span>{driver.name}</span>
          </div>
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Driver phone number</span>
            <span>{driver.number}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Car;
