import { IBooking } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";
import useAuth from "@/hooks/states/useAuth";
import { VscNotebook } from "react-icons/vsc";
import { SlOptionsVertical } from "react-icons/sl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ViewBookingDialog from "./ViewBookingDialog";
import EditBookingDialog from "../calendar-of-bookings/EditBookingDialog";
import DeleteBookingDialog from "../calendar-of-bookings/DeleteBookingDialog";

interface Props extends IBooking {}

const Booking = ({
  id,
  bookedBy,
  car,
  creditDeduction,
  date,
  dropOffTime,
  pickUpTime,
  instruction,
  location,
  title,
  editAttempts,
}: Props) => {
  const currentUser = useAuth((state) => state.auth);
  const bookingStatus =
    moment().isSameOrAfter(pickUpTime) && moment().isSameOrBefore(dropOffTime)
      ? "Ongoing"
      : "Upcoming";

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-row gap-x-4">
            <div
              className="flex size-[60px] items-center justify-center rounded-full text-white"
              style={{ backgroundColor: car.colorTag.label }}
            >
              <VscNotebook size={25} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>
                {car.model} - {car.plateNumber}
              </CardDescription>
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
                <ViewBookingDialog
                  id={id}
                  bookedBy={bookedBy}
                  car={car}
                  creditDeduction={creditDeduction}
                  date={date}
                  dropOffTime={dropOffTime}
                  pickUpTime={pickUpTime}
                  instruction={instruction}
                  location={location}
                  title={title}
                  bookingStatus={bookingStatus}
                  editAttempts={editAttempts}
                />
                {currentUser?.id === bookedBy.id &&
                  editAttempts === 0 &&
                  moment().isBefore(date, "date") && (
                    <EditBookingDialog
                      id={id}
                      bookedBy={bookedBy}
                      car={car}
                      creditDeduction={creditDeduction}
                      date={date}
                      dropOffTime={dropOffTime}
                      pickUpTime={pickUpTime}
                      instruction={instruction}
                      location={location}
                      title={title}
                      editAttempts={editAttempts}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Edit
                      </DropdownMenuItem>
                    </EditBookingDialog>
                  )}
                {currentUser?.id === bookedBy.id &&
                  moment().isBefore(date, "date") && (
                    <DeleteBookingDialog
                      bookingId={id}
                      bookedBy={bookedBy.name}
                      bookedById={bookedBy.id}
                      bookingColor={car.colorTag.label}
                      creditDeduction={creditDeduction}
                    >
                      <DropdownMenuItem
                        className="text-red-600 hover:bg-red-100 hover:text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DeleteBookingDialog>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Date</span>
            <span>{moment(date).format("LL")}</span>
          </div>
          <div className="flex items-center justify-between gap-x-10 text-sm">
            <span className="text-gray-600">Status</span>
            <span>{bookingStatus}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Booking;
