import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IBooking } from "@/types";
import moment from "moment";
import { Car } from "lucide-react";
import { useState } from "react";

interface Props extends IBooking {
  bookingStatus: string;
}

const ViewBookingDialog = ({
  id,
  car,
  date,
  dropOffTime,
  pickUpTime,
  instruction,
  location,
  title,
  bookingStatus,
}: Props) => {
  const bookingDetails = [
    {
      label: "Location",
      content: location,
    },
    {
      label: "Instruction",
      content: instruction,
    },
    {
      label: "Booking Date",
      content: moment(date).format("LL"),
    },
    {
      label: "Pick-up time",
      content: moment(pickUpTime).format("LT"),
    },
    {
      label: "Drop-off time",
      content: moment(dropOffTime).format("LT"),
    },
    {
      label: "Car",
      content: `${car.model} (${car.plateNumber})`,
    },
    {
      label: "Driver",
      content: `${car.driver.name} (${car.driver.number})`,
    },
    {
      label: "Status",
      content: bookingStatus,
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="w-full min-w-[600px]">
        <DialogHeader>
          <div className="flex flex-row items-center gap-x-4">
            <div
              className="flex size-[60px] items-center justify-center rounded-full text-white"
              style={{ backgroundColor: car.colorTag.label }}
            >
              <Car size={40} />
            </div>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>Booking ID: {id}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-y-4 text-sm">
          {bookingDetails.map((bookingDetail) => (
            <div
              key={bookingDetail.label}
              className="flex items-center justify-between"
            >
              <div className="flex-1 whitespace-nowrap text-start text-gray-600">
                {bookingDetail.label}
              </div>
              <div className="flex-[2] text-end">{bookingDetail.content}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookingDialog;
