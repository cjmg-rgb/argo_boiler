import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { IDriver } from "@/types";
import { SlOptionsVertical } from "react-icons/sl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditDriverDialog from "./EditDriverDialog";
import DeleteDriverDialog from "./DeleteDriverDialog";

interface Props extends IDriver {}

const Driver = ({ id, email, name, car, number }: Props) => {
  return (
    <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SlOptionsVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <EditDriverDialog
                id={id}
                email={email}
                name={name}
                car={car}
                number={number}
              />
              {car === null && <DeleteDriverDialog driverId={id} />}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Email</span>
            <span>{email}</span>
          </div>
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Phone number</span>
            <span>{number}</span>
          </div>
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Assigned Car</span>
            {car ? (
              <div className="flex items-center gap-x-1">
                <div
                  className="size-[6px] rounded"
                  style={{ backgroundColor: car?.colorTag.label }}
                ></div>
                <span>
                  {car?.model} - {car.plateNumber}
                </span>
              </div>
            ) : (
              <span>None</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Driver;
