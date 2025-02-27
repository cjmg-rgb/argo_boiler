import { IBooking } from "@/types";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import { Car } from "lucide-react";
import EditBookingDialog from "./EditBookingDialog";
import useAuth from "@/hooks/states/useAuth";
import { Button } from "../ui/button";
import DeleteBookingDialog from "./DeleteBookingDialog";

interface Props extends IBooking {
  closeViewBookingDialog: () => void;
}

const ViewBookingDialogContent = ({
  id,
  car,
  date,
  dropOffTime,
  pickUpTime,
  instruction,
  location,
  title,
  bookedBy,
  creditDeduction,
  editAttempts,
  closeViewBookingDialog,
}: Props) => {
  const auth = useAuth((state) => state!.auth);

  const bookingStatus =
    moment().isSameOrAfter(pickUpTime) && moment().isSameOrBefore(dropOffTime)
      ? "Ongoing"
      : moment().isAfter(dropOffTime)
        ? "Done"
        : "Upcoming";

  const bookingDetails = [
    {
      label: "Booked by",
      content: `${bookedBy.name} - ${bookedBy.department.name}`,
    },
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
      content: `${car.driver.name} - ${car.driver.number}`,
    },
    {
      label: "Status",
      content: bookingStatus,
    },
  ];

  return (
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
      <DialogFooter>
        {auth?.id === bookedBy.id &&
          editAttempts === 0 &&
          moment().isBefore(date, "date") && (
            <EditBookingDialog
              id={id}
              car={car}
              editAttempts={editAttempts}
              date={date}
              dropOffTime={dropOffTime}
              pickUpTime={pickUpTime}
              instruction={instruction}
              location={location}
              title={title}
              bookedBy={bookedBy}
              creditDeduction={creditDeduction}
              closeViewBookingDialog={closeViewBookingDialog}
            >
              <Button>Edit</Button>
            </EditBookingDialog>
          )}
        {auth?.id === bookedBy.id && moment().isBefore(date, "date") && (
          <DeleteBookingDialog
            bookingId={id}
            bookedBy={bookedBy.name}
            bookedById={bookedBy.id}
            bookingColor={car.colorTag.label}
            creditDeduction={creditDeduction}
            closeViewBookingDialog={closeViewBookingDialog}
          >
            <Button variant="destructive">Delete</Button>
          </DeleteBookingDialog>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default ViewBookingDialogContent;
